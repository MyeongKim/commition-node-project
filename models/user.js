var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var userSchema = mongoose.Schema({
	nickname: {
		type: String
	},
	email: {
		type: String
	},
	password:{
		type: String,
		bcrypt: true
	},
	stateMessage:{
		type: String,
		default : "안녕하세요, 반갑습니다."
	},
	account_number : {
		type: String
	},
	twitterId:{
		type:String
	},
	following : [{
		type: mongoose.Schema.Types.ObjectId,
		ref : 'User'
	}],
    follower : [{
    	type: mongoose.Schema.Types.ObjectId,
    	ref : 'User'
    }],
    hearted : [{
    	type: mongoose.Schema.Types.ObjectId,
    	ref : 'Commition'
    }],
    bought : [{
    	type: mongoose.Schema.Types.ObjectId,
    	ref : 'Commition'
    }],
    requestSend : [{
    	type: mongoose.Schema.Types.ObjectId,
    	ref : 'Request'
    }],
    requestReceive : [{
    	type: mongoose.Schema.Types.ObjectId,
    	ref : 'Request'
    }],
    alarmMessage: [{
    	type: String
    }],
	resetPasswordToken: String,
    resetPasswordExpires: Date
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function(newUser, callback) {
	bcrypt.hash(newUser.password, 10, function(err, hash){
		if(err) throw err;
		// Set hashed pw
		newUser.password = hash;
		// Create User
		newUser.save(callback)
	});
}
// Fetch All Classes
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

// Fetch Single Class
module.exports.getUserByEmail = function(email, callback){
	var query = {email: email};
	User.findOne(query, callback);
}

// Save Student
module.exports.saveStudent = function(newUser, newStudent, callback){
	bcrypt.hash(newUser.password, 10, function(err, hash){
		if(err) throw errl
		// Set hash
		newUser.password = hash;
		console.log('Student is being saved');
		async.parallel([newUser.save, newStudent.save], callback);
	});
}

// Save Instructor
module.exports.saveInstructor = function(newUser, newInstructor, callback){
	bcrypt.hash(newUser.password, 10, function(err, hash){
		if(err) throw errl
		// Set hash
		newUser.password = hash;
		console.log('Instructor is being saved');
		async.parallel([newUser.save, newInstructor.save], callback);
	});
}

// Compare password
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if(err) throw err;
		callback(null, isMatch);
	});
}