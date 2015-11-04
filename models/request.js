var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

// Request Schema

var requestSchema = mongoose.Schema({
	time : {
		type: Number
	},
	from : {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	to : {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	ref_commition : {
		type: Schema.Types.ObjectId,
		ref: 'Commition'
	},
	type : {
		type : String
	},
	phone : {
		type : String
	},
	deposit_name : {
		type : String
	},
	request_desc : {
		type : String
	},
	refer_files_name : [{
		type: String
	}]
});

var Request = module.exports = mongoose.model('Request', requestSchema);