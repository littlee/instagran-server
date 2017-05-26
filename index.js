var express = require('express')
var bodyParser = require('body-parser')
var superagent = require('superagent')
var cheerio = require('cheerio')
var app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/static', express.static('public'))

app.get('/', function(req, res) {
  res.send('hello')
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

app.listen(80, function() {
  console.log('server running on localhost:80')
})