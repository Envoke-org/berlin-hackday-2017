const envoke = require('./lib/index.js')
const driver = require('bigchaindb-driver')
const choo = require('choo')
const html = require('choo/html')
const log = require('choo-log')
const extend = require('xtend')
const css = require('sheetify')

css('./styles/bootstrap.min.css')

// BigchainDB server instance or IPDB (e.g. https://test.ipdb.io/api/v1/)
const API_PATH = 'http://localhost:9984/api/v1/'

const { newPerson, newOrganization, newMusicGroup } = envoke.schema

const app = choo()
app.use(log())
app.use(store)

app.route('/', Layout(require('./views/main')))
app.route('/create', Layout(require('./views/create')))
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

  if (!state.key) {
    const key = new driver.Ed25519Keypair()
    state.key = key
  }

  emitter.on('DOMContentLoaded', () => {
    emitter.on('create-key-pair', createKeyPair)
    emitter.on('create-transaction', createTransaction)
    emitter.on('create-user', createUser)
    emitter.on('update-type', (value) => {
      state.form.type = value
      emitter.emit('render')
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
    emitter.emit('pushState', '/create')
  }

  // Create a new keypair.
  function createKeyPair () {
    const key = new driver.Ed25519Keypair()
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
