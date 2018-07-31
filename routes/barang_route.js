var express = require('express');
var login_router = express.Router();
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

login_router.use(upload())
login_router.use('/file/', express.static('./file/'))
login_router.use(bodyParser.json());
login_router.use(cors())
login_router.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

login_router.get('/show_data', (req, res) => {
    Barang.find((err, data) => {
        res.send(data)
    })
})

// url : api/barang/
login_router.get('/', function (req, res) {

    res.sendFile(__dirname+ '/html/barang.html')

});

login_router.post('/', (req, res) => {
    if(req.files){

        console.log();
        var file = req.files.filename ;
        var filename = file.name ;
        file.mv('./file/' + filename, (x) => {
            if(x){
                console.log('upload gagal')
                res.send('gagal')
            }else{

                new Barang({

                    nama_barang: req.body.nama_barang,
                    harga: req.body.harga,
                    img: filename,
                    img_url: 'http://androrohmana.us.openode.io' + req.originalUrl + 'file/' + filename
                    
                }).save().then((data) => {

                    console.log('Data masuk: '+ data);
                    res.send(data);

                })
            }
        })

    } else {
        res.send('tidak ada request')
    }
})


module.exports = login_router;