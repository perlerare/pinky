var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	role: {
		type: Number
	},
	friends: {
		type: []
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(newUser.password, salt, function(err, hash) {
					newUser.password = hash;
					newUser.save(callback);
			});
	});
}

module.exports.updateUser = function(user,userUpdated, callback){
console.log(user);
	User.getUserById(user._id, function(err, userToUpdate) {
		if (err) throw err;
		userToUpdate.name =  userUpdated.name;
		userToUpdate.username = userUpdated.username;
		userToUpdate.email = userUpdated.email;
		userToUpdate.save();
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
			if(err) throw err;
			callback(null, isMatch);
	});
}

module.exports.getUsersList = function(callback){
	var query = {role:1};
	User.find(query, callback);
}

module.exports.deleteUser = function(userName,callback){console.log(userName);
	var query = {name:userName};
	User.find(query).remove().exec();
}

module.exports.SearchForUserByUsername = function(username, callback){
	var query = {username: /username/i};
	User.find(query, callback);
}
