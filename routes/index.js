var express = require('express');
var router = express.Router();

var User = require('../modules/user');
var server = require('http');
var io = require('socket.io').listen(server,{});

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index');
});

router.post('/',function(req,res,next) {
	var searchUser = req.body.searchUser;

	// Validation
	req.checkBody('searchUser', 'Veuillez saisir une requête dans le champ ci-dessous.').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('index',{
			errors:errors
		});
	}else {
		User.getUserByUsername(searchUser, function(err, user){
			if(err) throw err;
			if(!user){
				req.flash('error_msg', 'Aucun résultat pour votre recherche.');
			} else {
				console.log(user);
				res.render('index',{
					friends:user
				});
			}
		});
		// res.redirect('/');
	}

});
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
};

module.exports = router;
