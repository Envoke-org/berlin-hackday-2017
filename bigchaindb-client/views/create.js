const html = require('choo/html')

module.exports = function (state, emit) {
  return html`
    <div class="container">
      <form>
        <input ondrop=${drop} type="file" id="file" name="file" />
      </form>
    </div>
  `

  function drop (e) {
    console.log(e)
  }
}
