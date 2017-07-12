const html = require('choo/html')
const xhr = require('xhr')

module.exports = function (state, emit) {
  return html`
    <div class="container ${state.dragging ? 'dragging' : ''} ${state.dropped ? 'dragging' : ''}" style="position:relative;padding:0;">
      <div class="form-group dropzone" ondragover=${onDragOver} ondragleave=${onDragleave}>
        <div><span class="drop-info">${state.dragging ? 'Drop now !' : 'Drop a file'}</span></div>
        <input onchange=${onChange} type="file" id="files" />
      </div>
    </div>
  `

  function onDragOver (e) {
    e.preventDefault()
    e.stopPropagation()
    if (state.dragging) {
      // already dragging
      return false
    }
    emit('dragging')
  }

  function onDragleave (e) {
    e.preventDefault()
    e.stopPropagation()
    emit('dragleave')
  }

  function onChange (e) {
    e.preventDefault()
    e.stopPropagation()

    const files = e.target.files[0]

    const reader = new window.FileReader()

    reader.onload = (e) => {
      const music = e.target.result

      const formData = new window.FormData()
      formData.append('myFile', files)

      const options = {
        method: 'POST',
        url: `https://www.auggod.io/resonate/`,
        body: formData
      }

      xhr(options, (err, res, body) => {
        if (err) { return }
        const json = JSON.parse(body)
        const { data, hash } = json
        emit('set-metadata', {metadata: data.format.tags, hash})
      })

      // see link
      var audio = new window.Audio(music)
      audio.play()
    }
    // substitute `readAsDataURL` for `readAsArrayBuffer`
    reader.readAsDataURL(files)

    emit('dragleave')
  }
}
