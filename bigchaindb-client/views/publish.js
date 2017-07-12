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
      ${state.metadata ? html`
        <div>
          ${getMetadata()}
        </div>
      ` : ''}
    </div>
  `
}
