var express = require('express');
var login_router = express.Router();
var bcrypt = require('bcrypt');
var session = require('express-session')
var User = require('../models/user_model');
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');

var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var url = "mongodb://teman_andro:teman_andro101@ds139951.mlab.com:39951/teman_andro" ;
mongoose.connect(url);
var MongoStore = require('connect-mongo')(session);

var transporter = nodemailer.createTransport({
	service:'gmail',
	auth: {
		type: 'OAuth2',
		user: 'info.offis.id@gmail.com',
		clientId: '1055455812439-64ga33t2crk1u8arb3da6e9oij24mjri.apps.googleusercontent.com',
		clientSecret: 'NrgUYphhUabBlfD4nrRiXXhR',
		refreshToken: '1/698Z9j-mIyeCVIWECOeqhuDzPBem11u29sJq9cOq7tTqZIF2OInQBM10VDLj6zu-'
	}
})

login_router.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));
login_router.use(bodyParser.json());
login_router.use(cors())

// url : api/login/ 
login_router.get('/', function (req, res) {
	User.find((err, user)=>{
		res.send(user);
	})
});

login_router.post('/', (req, res) => {

	if (req.body.logemail && req.body.logpassword) {
		User.findOne({ email: req.body.logemail }, (err, user) => {
			if (user) {
				if(bcrypt.compareSync(req.body.logpassword, user.password)){
					// req.session.userId = user._id;
					// req.session.userEmail = user.email;
					// req.session.userUsername = user.username;
					return res.send(user);
				} else {
					return res.send(err);
				}
				
			} else {
				return res.send(err)
			}
		});
	} 
})

login_router.get('/confirm_registrasi/:_id/:pass', (req, res) => {
	if(req.params._id && req.params.pass){

		User.findOne({ _id: req.params._id }, (err, user) => {
			if (user) {

				if(req.params.pass === user.password){

					User.findOneAndUpdate({_id: req.params._id }, {$set:{status: 1}} , (err, doc) => {

						if(err){

							res.send(err)
						}

						res.send(doc)
					});

				} else {

					res.send(err)

				}
				 
			} else {

				res.send(err)
			}
		});

	} else {

	}
})

login_router.post('/register', function(req, res){

	if (req.body.email && req.body.username && req.body.password ) {
		// console.log(data_find.length)

		User.findOne({ email: req.body.email }, function(err, user) {
			if (user) {
				return res.send(user);
			}

			var salt = bcrypt.genSaltSync(10);
			new User({
				username: req.body.username,
				email: req.body.email,
				password: bcrypt.hashSync(req.body.password, salt),
				status: 0
			}).save().then((data)=>{

				var link_konfrim = 'http://temanandro.netlify.com/' + 'api/login/ ' + 'confirm_registrasi/' + data._id + '/'+ data.password ;
				var konfirmasi_kirim = {

					from: 'Teman Andro <info.offis.id@gmail.com>',
					to: data.email,
					subject: 'Aktivasi Akun dari Teman Andro',
					html: '<h2>Hallo para Teman Andro</h2><p>Klik link di bawah ini untuk aktivasi akun anda</p><a href="'+link_konfrim+'">'+link_konfrim+'</a>'
				
				}

				transporter.sendMail(konfirmasi_kirim, (err, res)=> {
					if(err){

						console.log(err)

					}else{

						console.log(res)
					}
				});

				console.log('Data masuk: '+ data);
				res.send(data);
			}) 
		});

	} else {

		res.send('Data masih ada yang kosong')
 
	}
	
});

login_router.post('/auth_pass', (req, res) => {
	if (req.body.pass_auth) {

		User.findOne({ password: req.body.pass_auth }, (err, user) => {
			if (user) {
				if(req.body.pass_auth === user.password){
					// req.session.userId = user._id;
					// req.session.userEmail = user.email;
					// req.session.userUsername = user.username;
					return res.send(user);
				} else {
					return res.send(err);
				}
				
			} else {
				return res.send(err)
			}
		});

	} else {

	}
})

login_router.get('/logout/user', (req, res) => {

	if(req.body.pass_auth){
		console.log(req.body.pass_auth)
	} else {
		console.log(req.body.pass_auth)
	}
	
	// req.session.destroy((response)=>{
	// 	console.log(response)
	// 	// console.log(data)
	// })

	var session_userId = ()=>{
		req.session.userOid = req.session.userId
	};

	res.send(session_userId);
})

login_router.get('/:nama', function (req, res) {
	return res.send("<h1>Anda mengirim request GET /"+req.params.nama+"</h1>");
});

module.exports = login_router;