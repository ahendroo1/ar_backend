var express = require('express');
var app = express();
var port = process.env.PORT || 3002;

var bodyParser = require('body-parser');
var session = require('express-session');
var compress = require('compression');
var renderer = require('./api/index');
var login_render = require('./api/login_route');
var user_render = require('./api/user_route');
var store_render = require('./api/store_route');
var barang_render = require('./api/barang_route');

var cors = require('cors');
var mongoose = require('mongoose');
var url = "mongodb://teman_andro:teman_andro101@ds139951.mlab.com:39951/teman_andro" ;
var MongoStore = require('connect-mongo')(session);
mongoose.connect(url);

// app.set('view engine', 'ejs');
app.use(session({

    secret: 'xbackend',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })

}));

app.use('/file/', express.static('./file/'))
app.use('/assets/', express.static('./assets/'))
app.use(cors());
app.use(compress());
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({ extended: true })); 

// app.use('/admin', admin_render);
app.use('/',  renderer);
app.use('/api/login', login_render);
app.use('/api/user', user_render);
app.use('/api/store', store_render);
app.use('/api/barang', barang_render);
 
// app.get('/' (req, res) => {
//      res.send('ksxnksjxnks')
// })

// app.use('/admin/barang', barang_render);

app.listen(port, () => {
    console.log('server active');
}); 