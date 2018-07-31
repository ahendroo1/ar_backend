var express = require('express');
var app = express();
var port = process.env.PORT || 3002;

var bodyParser = require('body-parser');
var compress = require('compression');
var renderer = require('./routes/index');
var login_render = require('./routes/login_route');
var user_render = require('./routes/user_route');
var store_render = require('./routes/store_route');
var barang_render = require('./routes/barang_route');
var cors = require('cors');

app.use(cors());
app.use(compress());
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', renderer);
app.use('/api/login', login_render);
app.use('/api/user', user_render);
app.use('/api/store', store_render);
app.use('/api/barang', barang_render);

app.listen(port, ()=>{
    console.log('server active');
});
