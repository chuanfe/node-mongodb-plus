var express = require('express')
var path = require('path')
var session = require('express-session')
var morgan = require('morgan')
var mongoose = require('mongoose')
var mongoStore = require('connect-mongo')(session)
var bodyParser = require('body-parser')
var port = process.env.PORT || 3000
var app = express()
var dbUrl = 'mongodb://localhost:27017/wuch'

mongoose.connect(dbUrl,{useMongoClient: true})

app.set('views','./views/pages')
app.set('view engine', 'jade')
app.use(bodyParser.urlencoded())
app.use(session({
    secret: 'imooc',
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}))

if('development' === app.get('env')) {
    app.set('showStackError', true)
    app.use(morgan(':method :url :status'))
    app.locals.pretty = true
    mongoose.set('debug', true)
}

require('./config/routes')(app)

app.use(express.static(path.join(__dirname, 'public')))
app.locals.moment = require('moment')
app.listen(port)

console.log('node start on port' + port)
