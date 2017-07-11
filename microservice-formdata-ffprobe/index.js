const ffprobe = require('ffprobe')
const ffprobeStatic = require('ffprobe-static')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const formidable = require('formidable')
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/', function (req, res, next) {
  res.send('OK')
})

app.post('/', function (req, res, next) {
  const form = new formidable.IncomingForm()

  form.parse(req, function (err, fields, files) {
    if (err) return next(err)
    ffprobe(files.myFile.path, { path: ffprobeStatic.path }, function (err, info) {
      if (err) return next(err)
      console.log(info)
      return res.json({data: info})
    })
  })
})

app.listen(8085, function () {
  console.log('CORS-enabled web server listening on port 80')
})
