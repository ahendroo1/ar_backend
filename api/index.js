var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	// console.log(req.protocol)
	return res.send("<h1>Back End !</h1>");
});

// router.get('/:nama', function (req, res) {
// 	return res.send("<h1>Anda mengirim request GET / "+req.params.nama+"</h1>");
// });

module.exports = router ;