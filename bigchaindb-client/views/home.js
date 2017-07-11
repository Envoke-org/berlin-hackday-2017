const html = require('choo/html')

module.exports = function (state, emit) {
  return html`
    <div class="container">
      <a class="btn btn-big" href="/register">Register</a>
    </div>
  `
}
