var express = require('express')
var bodyParser = require('body-parser')
var superagent = require('superagent')
var cheerio = require('cheerio')
var http = require('http')
var https = require('https')
var fs = require('fs')
var app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/static', express.static('public'))

app.get('/', function(req, res) {
  res.send('instagran-server')
})

app.post('/api/getimg', function(req, res) {
  superagent
    .post('http://www.dinsta.com/photos/')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({
      url: req.body.url
    })
    .end(function(err, resp) {
      if (err) {
        throw err
      }

      var $ = cheerio.load(resp.text)

      res.json({
        url: $('img').attr('src')
      })
    })
})

app.get('/info', function(req, res) {
  res.send(require('./ddb/db.json'))
})

app.use(function(err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('500 Server Error')
})

http.createServer(app).listen(80)
https
  .createServer(
    {
      pfx: fs.readFileSync('./www.littlee.xyz.pfx'),
      passphrase: fs.readFileSync('./pass.pass')
    },
    app
  )
  .listen(443)
