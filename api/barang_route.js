var express = require('express');
var barang_route = express.Router();
var bcrypt = require('bcrypt');
var session = require('express-session');
var User = require('../models/user_model');
var Barang = require('../models/barang_model');
var upload = require('express-fileupload');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var url = "mongodb://teman_andro:teman_andro101@ds139951.mlab.com:39951/teman_andro" ;
var MongoStore = require('connect-mongo')(session);

mongoose.connect(url);

barang_route.use(upload())
barang_route.use('/file/', express.static('./file/'))
barang_route.use(bodyParser.json());
barang_route.use(cors())
barang_route.use(session({
    secret: 'xbackend',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

barang_route.get('/show_barang', (req, res) => {
    Barang.find((err, data) => {
        res.send(data)
    })
})

// url : api/barang/
barang_route.get('/', function (req, res) {
    res.sendFile(__dirname + '/html/barang.html')
});

barang_route.post('/', (req, res) => {

    // console.log(req)

    if(req.files){

        var file = req.files.file ;
        var filename = file.name ;
        file.mv('./file/' + filename, (x) => {
            if(x){

                res.send(x)

            } else {

                new Barang({

                    nama_barang: req.body.nama_barang,
                    harga: req.body.harga,
                    img: filename,
                    img_url: 'http://localhost:3002' + req.originalUrl + '/file/' + filename
                    
                }).save().then((data) => {

                    console.log('Data masuk: ' + data);
                    res.send(data);

                })
            }
        })

    } else {

        console.log('tidak ada data')
        res.send('tidak ada request')

    }
})

barang_route.get('/admin/all_barang', (req, res) => {

})

module.exports = barang_route;