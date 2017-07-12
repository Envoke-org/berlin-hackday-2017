const html = require('choo/html')
const _map = require('lodash/map')

module.exports = function (state, emit) {
  function getMetadata () {
    const items = _map(state.metadata.metadata, (item, obj) => {
      return html`
        <div>
          ${item}
        </div>
      `
    })
    return items
  }
  return html`
    <div class="container">
      <h1 style="text-align: center;">${state.mnemonic}</h1>
      <button onclick=${(e) => generateMnemonic()}>Generate a new mnemonic</button>
      ${state.mnemonic ? html`<button onclick=${(e) => keypairFromMnemonic()}>Generate keypair from mnemonic</button>` : ''}
      ${state.keyPair && state.metadata.metadata ? html`
        <div>
          ${getMetadata()}
          <button class="btn btn-big" onclick=${(e) => { emit('publish', state.metadata) }}>Publish !</button>
        </div>
      ` : 'No metadata to show, can\'t publish!'}
      ${state.transaction.id ? html`
        <div>
          <a class="btn btn-big" href="https://main.ipdb.io/api/v1/transactions/${state.transaction.id}" target="_blank" rel="noopener">Check transaction</a>
        </div>
      ` : ''}
    </div>
  `

  function generateMnemonic () {
    emit('generate-mnemonic')
  }

  function keypairFromMnemonic () {
    emit('keypair-from-mnemonic')
  }
}
