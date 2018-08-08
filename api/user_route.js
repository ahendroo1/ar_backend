var express = require('express');
var login_router = express.Router();
var bcrypt = require('bcrypt');
var session = require('express-session')
var User = require('../models/user_model');

var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var url = "mongodb://teman_andro:teman_andro101@ds139951.mlab.com:39951/teman_andro" ;
mongoose.connect(url);
var MongoStore = require('connect-mongo')(session);

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

login_router.get('/:user_id', function (req, res) {

	User.findOne({ _id:req.params.user_id }, (err, user)=>{
		res.send(user);
		// console.log(req.session)
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
				console.log('Data masuk: '+ data);
				res.send(data);
			}) 
		});

	} else {

		res.send('Data masih ada yang kosong')
 
	}
	
});

login_router.get('/session', (req, res) => {
	var data_session = req.session;
	console.log(req.session)
	res.send(data_session)
})
 
login_router.get('/logout/user', (req, res) => {

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