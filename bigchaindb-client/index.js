const envoke = require('./lib/index.js')
const driver = require('bigchaindb-driver')
const choo = require('choo')
const html = require('choo/html')
const log = require('choo-log')
const extend = require('xtend')
const css = require('sheetify')
const bdb = require('./bdb/index.js')

css('./styles/bootstrap.min.css')
css('./styles/layout.css')

// BigchainDB server instance or IPDB (e.g. https://test.ipdb.io/api/v1/)
const API_PATH = 'http://localhost:9984/api/v1/'

const { newPerson, newOrganization, newMusicGroup } = envoke.schema

const app = choo()
app.use(log())
app.use(store)

app.route('/', Layout(require('./views/home')))
app.route('/register', Layout(require('./views/main')))
app.route('/key', Layout(require('./views/key')))
app.route('/upload', Layout(require('./views/upload')))
app.route('/publish', Layout(require('./views/publish')))
app.mount('body')

function Layout (View) {
  return (state, emit) => {
    return html`
      <body>
        ${View(state, emit)}
      </body>
    `
  }
}

function store (state, emitter) {
  if (!state.form) {
    state.form = {
      birthDate: '',
      familyName: '',
      givenName: '',
      image: '',
      name: '',
      description: '',
      email: '',
      members: '',
      type: 'Person'
    }
  }

  state.mnemonic = state.mnemonic || ''
  state.keyPair = state.keyPair || ''

  state.dragging = false

  emitter.on('DOMContentLoaded', () => {
    emitter.on('create-key-pair', createKeyPair)
    emitter.on('create-transaction', createTransaction)
    emitter.on('create-user', createUser)
    emitter.on('update-type', (value) => {
      state.form.type = value
      emitter.emit('render')
    })
    emitter.on('dragging', () => {
      state.dragging = true
      emitter.emit('render')
    })
    emitter.on('dragleave', () => {
      state.dragging = false
      emitter.emit('render')
    })
    emitter.on('generate-mnemonic', () => {
      state.mnemonic = bdb.generateMnemonic()
      emitter.emit('render')
    })
    emitter.on('keypair-from-mnemonic', () => {
      state.keyPair = bdb.keypairFromMnemonic(state.mnemonic)
      emitter.emit('render')
    })
    emitter.on('publish', (payload) => {
      const { data = { city: 'Berlin, DE', temperature: 22 } } = payload
      bdb.publish(state.keyPair, extend(data, {
        datetime: new Date().toString()})
      )
    })
    emitter.on('get-transaction', (payload) => {
      bdb.getTransaction()
    })
  })

  function createUser (payload) {
    const {
      type = 'Person',
      birthDate = '',
      familyName = '',
      givenName = '',
      image = '',
      name = '',
      description = '',
      email = '',
      members = ''
    } = payload

    function setUser () {
      switch (type) {
        case 'Person':
          return newPerson(birthDate, familyName, givenName, image)
        case 'Organization':
          return newOrganization(name, description, email, members, image)
        case 'MusicGroup':
          return newMusicGroup(name, description, email, members, image)
        default:
      }
    }

    const user = setUser()

    state.form = payload
    state.user = user
    console.log(user)
    emitter.emit('pushState', '/create')
  }

  // Create a new keypair.
  function createKeyPair () {
    const key = bdb.generateKeypair()
    state.key = key
    emitter.emit('render')
  }

  // Construct a transaction payload
  function createTransaction (payload) {
    const { data, metadata } = payload
    const tx = driver.Transaction.makeCreateTransaction(extend(data, {
      datetime: new Date().toString()
    }), metadata, [ driver.Transaction.makeOutput(
      driver.Transaction.makeEd25519Condition(state.key.publicKey))],
      state.key.publicKey
    )

    // Sign the transaction with private keys
    const txSigned = driver.Transaction.signTransaction(tx, state.key.privateKey)

    // Send the transaction off to BigchainDB
    const conn = new driver.Connection(API_PATH)

    conn.postTransaction(txSigned)
      .then(() => conn.pollStatusAndFetchTransaction(txSigned.id))
      .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))
  }
}
