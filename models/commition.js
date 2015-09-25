var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;
// Commition Schema
var commitionSchema = mongoose.Schema({
	time : {
		type: Number
	},
	user : {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	heart : {
		type: Number,
		default: 0
	},
	view : {
		type: Number,
		default:0
	},
	title : {
		type: String
	},
	email : {
		type: String
	},
	twitterId : {
		type: String
	},
	password : {
		type: String
	},
	time_spent : {
		type: String
	},
	process : {
		type: String
	},
	warning : {
		type: String
	},
	etc : {
		type: String
	},
	end_time : {
		type: Date
	},
	slot_full : {
		type: Number
	},
	slot_open : {
		type: Number
	},
	type_one: {
		files_name:[{type: String}],
		files_size:{type: String},
		type_desc:{type: String},
		price:{type: String},
		tag : [{type: String}]
	},
	type_two: {
		files_name:[{type: String}],
		files_size:{type: String},
		type_desc:{type: String},
		price:{type: String},
		tag : [{type: String}]
	},
	type_three: {
		files_name:[{type: String}],
		files_size:{type: String},
		type_desc:{type: String},
		price:{type: String},
		tag : [{type: String}]
	},
	thumbnail_files_name : [{
		type: String
	}]
});

var Commition = module.exports = mongoose.model('Commition', commitionSchema);


// Fetch All Commitions
module.exports.getCommitionById = function(id, callback){
	Commition.findById(id, callback);
}

// Save Instructor
module.exports.saveCommition = function(newCommition, callback){
	bcrypt.hash(newCommition.password, 10, function(err, hash){
		if(err) throw err;
		// Set hash
		newCommition.password = hash;
		console.log('Commition is being saved');
		async.parallel([newCommition.save], callback);
	});
}

// Compare password
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if(err) throw err;
		callback(null, isMatch);
	});
}