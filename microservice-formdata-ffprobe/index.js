const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const formidable = require('formidable')
const createHash = require('sha.js')
const sha256 = createHash('sha256')
const app = express()
const shell = require('shelljs')

app.use(cors())
app.use(bodyParser.json())

app.get('/', function (req, res, next) {
  res.send('OK')
})

app.post('/', function (req, res, next) {
  const form = new formidable.IncomingForm()

  form.parse(req, function (err, fields, files) {
    if (err) return next(err)
    const file = files.myFile
    const hash = sha256.update(file, 'utf8').digest('hex')
    return res.json({
      data: JSON.parse(shell.exec(`ffprobe -v quiet -print_format json -show_format -show_streams ${file.path}`)),
      hash
    })
  })
})

app.listen(8085, function () {
  console.log('CORS-enabled web server listening on port 80')
})
