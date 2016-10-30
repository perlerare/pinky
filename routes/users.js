var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../modules/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
	// res.io.emit("socketToMe", "it works");
	res.send('respond with a resource.');
});

router.get('/login', function(req, res, next) {
	res.render('login');
});

passport.use(new LocalStrategy(
	function(username, password, done) {
	 User.getUserByUsername(username, function(err, user){
		 if(err) throw err;
		 if(!user){
			 return done(null, false, {message: 'Unknown User'});
		 }

		 User.comparePassword(password, user.password, function(err, isMatch){
			 if(err) throw err;
			 if(isMatch){
				 return done(null, user);
			 } else {
				 return done(null, false, {message: 'Invalid password'});
			 }
		 });
	 });
	}));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
	function(req, res) {
		res.redirect('/');
	}
);


router.get('/register', function(req, res, next) {
	res.render('register');
});

router.post('/register', function(req, res, next) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password,
			role: 1
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	};
});

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

router.get('/updateProfile', function(req, res, next) {
	res.render('updateProfile');
});

router.post('/updateProfile', function(req, res, next) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('users/updateProfile',{
			errors:errors
		});
	} else {
		User.updateUser(req.user,{
			name: name,
			email:email,
			username: username
		},function(err,updatedUser) {
			if(err) throw err;
		});
		req.flash('success_msg', 'votre profile a été modifié');

		res.redirect('/users/updateProfile');
	};
});

router.get('/membersList',function(req,res,next) {
	User.getUsersList(function(err,list) {

		res.render('membersList',{
			members:list
		});

	});
});

router.post('/membersList',function(req,res,next) {
	var member = req.body.membre;

	User.deleteUser(member,function(err) {
		if(err) throw err;
	});
	req.flash('success_msg', 'le membre a été supprimé');

	res.redirect('/users/membersList');
});

module.exports = router;
