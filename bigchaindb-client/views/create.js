const html = require('choo/html')

module.exports = function (state, emit) {
  return html`
    <div class="container">
      <form>
        <input onchange=${onChange} type="file" id="files" />
      </form>
    </div>
  `

  function onChange (e) {
    e.preventDefault()
    e.stopPropagation()
    const files = e.target.files[0]
    const types = !((/audio\/mpeg|audio\/mp3|audio\/mp4|audio\/ogg|audio\/x+|wav/).test(files.type))

    if (types) {
      window.alert('no audio file')
      return
    }

    var reader = new window.FileReader()

    console.log(reader)

    reader.onload = (e) => {
      const music = e.target.result
      // see link
      var audio = new window.Audio(music)
      audio.play()
    }
    // substitute `readAsDataURL` for `readAsArrayBuffer`
    reader.readAsDataURL(files)
  }
}
