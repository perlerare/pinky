var express = require('express');
var router = express.Router();

var User = require('../modules/user');
var server = require('http');
var io = require('socket.io').listen(server,{});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		// req.flash('error_msg','You are not logged in');
		res.redirect('/chat');
	}
};


module.exports = function(io) {
		var app = require('express');
		var router = app.Router();

		var connections = [];
		// Get Homepage
		router.get('/chat', ensureAuthenticated, function(req, res){
			res.render('index');
		});

		io.on('connection',function(socket){
			connections.push(socket);
			console.log('Number of connected scokets :  %s',connections.length);

			// io.emit('socketToMe','hi from server');
			// io.on('hi', function (data) {
			// 	console.log(data);
			// });
			io.on('disconnect', function() {
					var i = connections.indexOf(socket);
					connections.splice(i, 1);
					console.log('disconnected: %s connected scokets',connections.length);
					// console.log('disconnected');
				}); // disconnect
		});// connction

		return router;
}
