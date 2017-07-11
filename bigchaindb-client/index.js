const envoke = require('./lib/index.js')
const driver = require('bigchaindb-driver')
const html = require('choo/html')
const log = require('choo-log')
const choo = require('choo')
const extend = require('xtend')

// BigchainDB server instance or IPDB (e.g. https://test.ipdb.io/api/v1/)
const API_PATH = 'http://localhost:9984/api/v1/'

const { schema } = envoke

const app = choo()
app.use(log())
app.use(store)
app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
  function handleSubmit(e) {
    e.preventDefault()
    emit('create-user', {
      birthDate : e.target.birthDate.value,
      familyName : e.target.familyName.value,
      givenName : e.target.givenName.value,
      image: e.target.image.value
    })
  }
  return html`
    <body>
      ${state.user}
      <form onsubmit=${handleSubmit}>
        <input type="text" name="birthDate" placeholder="Birthdate: MM/DD/YYYY" value=${state.form.birthDate} />
        <input type="text" name="familyName" placeholder="Family name" value=${state.form.familyName} />
        <input type="text" name="givenName" placeholder="Given name" value=${state.form.givenName} />
        <input type="text" name="image" placeholder="Image url" value=${state.form.image} />
        <button type="submit">Register</button>
      </form>
    </body>
  `
}

function store (state, emitter) {
  state.form = {
    birthDate: '',
    familyName: '',
    givenName: '',
    image: ''
  }

  if (!state.key) {
    const key = new driver.Ed25519Keypair()
    state.key = key
  }

  emitter.on('DOMContentLoaded', () => {
    emitter.on('create-key-pair', createKeyPair)
    emitter.on('create-transaction', createTransaction)
    emitter.on('create-user', createUser)
  })

  function createUser (payload) {
    const { birthDate, familyName, givenName, image } = payload
    const user = schema.newPerson(birthDate, familyName, givenName, image)

    state.form = payload
    state.user = user
    console.log(user, payload)
    emitter.emit('render')
  }

  // Create a new keypair.
  function createKeyPair () {
    const key = new driver.Ed25519Keypair()
    state.key = key
    console.log(key)
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
