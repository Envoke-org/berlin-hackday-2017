const html = require('choo/html')

module.exports = function (state, emit) {
  return html`
    <div class="container">
      <h1 style="text-align: center;">${state.mnemonic}</h1>
      <button onclick=${(e) => generateMnemonic()}>Generate a new mnemonic</button>
      ${state.mnemonic ? html`<button onclick=${(e) => keypairFromMnemonic()}>Generate keypair from mnemonic</button>` : ''}
      ${state.keyPair ? html`<button onclick=${(e) => publish()}>Publish</button>` : ''}
    </div>
  `

  function generateMnemonic () {
    emit('generate-mnemonic')
  }

  function keypairFromMnemonic () {
    emit('keypair-from-mnemonic')
  }

  function publish () {
    emit('publish', {})
  }
}
