var express = require('express');
var router = express.Router();
var multer  = require('multer');
var fs = require('fs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// Include User Model
var User = require('../models/user');
var Commition = require('../models/commition');
var Request = require('../models/request');


/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.user){
		res.render('submit', {'active_submit' : true});
	}
	else{
		req.flash('alert alert-warning', '로그인이 필요합니다.');
		res.redirect('/user/login');
	}
});

// multer upload settings

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, 'invalid-'+ (req.user.email || req.user.twitterId) +'-'+ req.body.time +'-'+ file.originalname.replace(/\s/g, "-"))
  }
});

var preUpload = multer({ storage: storage});

var cpUpload = preUpload.fields([
					{ name: 'type_one_files_name'},
					{ name: 'type_two_files_name'},
					{ name: 'type_three_files_name'},
					{ name: 'thumbnail_files_name'}
				]);

router.post('/', cpUpload, function(req, res, next) {

	// Get Form Values
	console.log(req.body);

	if(Object.keys(req.files).indexOf('type_one_files_name') === -1 ){
		req.files.type_one_files_name = [];
	}

	if(Object.keys(req.files).indexOf('type_two_files_name') === -1 ) {
		req.files.type_two_files_name = [];
	}

	if(Object.keys(req.files).indexOf('type_three_files_name') === -1 ) {
		req.files.type_three_files_name = [];
	}

	if(Object.keys(req.files).indexOf('thumbnail_files_name') === -1 ) {
		req.files.thumbnail_files_name = [];
	}

	var time 					= req.body.time;
	var password    			= req.body.password;
	var password2				= req.body.password2;
	var time_spent     			= req.body.time_spent;
	var process    				= req.body.process;
	var warning 				= req.body.warning;
	var etc 					= req.body.etc;
	var end_time 				= req.body.end_time;
	var slot_full            	= req.body.slot_full;
	var slot_open            	= req.body.slot_open;
	var type_one_tag 			= req.body.type_one_tag;
	var type_one_files_size     = req.body.type_one_files_size;
	var type_one_type_desc      = req.body.type_one_type_desc;
	var type_one_price          = req.body.type_one_price;
	var type_two_tag 			= req.body.type_two_tag;
	var type_two_files_size     = req.body.type_two_files_size;
	var type_two_type_desc      = req.body.type_two_type_desc;
	var type_two_price          = req.body.type_two_price;
	var type_three_tag 			= req.body.type_three_tag;
	var type_three_files_size   = req.body.type_three_files_size;
	var type_three_type_desc    = req.body.type_three_type_desc;
	var type_three_price        = req.body.type_three_price;

	// Form Field Validation
	req.checkBody('password', '비밀번호를 입력해주세요.').notEmpty();
	req.checkBody('password2', '비밀번호가 맞지 않습니다.').equals(req.body.password);
	req.checkBody('slot_open', '전체 슬롯보다 열려있는 슬롯의 갯수가 더 많습니다.').lee(req.body.slot_full);
	req.checkFiles('type_one_files_name', '타입 1의 그림 파일을 9장 이하로 변경해주세요.').lengthCheck(9);
	req.checkFiles('type_two_files_name', '타입 2의 그림 파일을 9장 이하로 변경해주세요.').lengthCheck(9);
	req.checkFiles('type_three_files_name', '타입 3의 그림 파일을 9장 이하로 변경해주세요.').lengthCheck(9);
	req.checkFiles('thumbnail_files_name', '썸네일 이미지는 정확히 3장이 필요합니다.').thumbnailCheck(3);

	var errors = req.validationErrors();	
	if(errors){

		fs.readdir('./public/uploads/', function(err, files){
			if (err) { throw err}
			for( var i = 0; i < files.length ; i++){
				if ( files[i].substring(0,8) === "invalid-" && files[i].indexOf(req.user.email || req.user.twitterId) > -1){
					fs.unlink('./public/uploads/'+files[i], function(err){
						if(err){ throw err};
					})
				}
				
			}
		});

		res.render('submit', {
			errors: errors,
			password: password,
			password2: password2,
			time_spent: time_spent,
			process: process,
			warning: warning,
			etc: etc,
			end_time: end_time,
			slot_full: slot_full,
			slot_open: slot_open,
			type_one_tag: type_one_tag,
			type_one_files_size: type_one_files_size,
			type_one_type_desc: type_one_type_desc,
			type_one_price: type_one_price,
			type_two_tag: type_two_tag,
			type_two_files_size: type_two_files_size,
			type_two_type_desc: type_two_type_desc,
			type_two_price: type_two_price,
			type_three_tag: type_three_tag,
			type_three_files_size: type_three_files_size,
			type_three_type_desc: type_three_type_desc,
			type_three_price: type_three_price
		});

	} else {
		fs.readdir('./public/uploads/', function(err, files){
			if (err) { throw err}
			for( var i = 0; i < files.length ; i++){
				if ( files[i].substring(0,8) === "invalid-" && files[i].indexOf(req.user.email || req.user.twitterId) > -1 ){
					fs.rename('./public/uploads/'+ files[i] , './public/uploads/'+ 'valid-'+ files[i].substring(8), function(err){
						if(err) { throw err}
					});
				}
			}
		});

		var type_one_files_name    				= req.files.type_one_files_name;
		var type_two_files_name    				= req.files.type_two_files_name;
		var type_three_files_name   			= req.files.type_three_files_name;
		var thumbnail_files_name    			= req.files.thumbnail_files_name;

		var type_one_files_name_length   		= type_one_files_name.length;
		var type_two_files_name_length  		= type_two_files_name.length;
		var type_three_files_name_length  	 	= type_three_files_name.length;

		var type_one_files_name_array 			= [];
		var type_two_files_name_array 			= [];
		var type_three_files_name_array 		= [];
		var thumbnail_files_name_array 			= [];

		for (var i = 0 ; i < type_one_files_name_length ; i++){
			var validName = type_one_files_name[i].filename.replace("invalid","valid").replace(/\s/g, "-");
			type_one_files_name_array.push(validName);
		}

		for (var i = 0 ; i < type_two_files_name_length ; i++){
			var validName = type_two_files_name[i].filename.replace("invalid","valid").replace(/\s/g, "-");
			type_two_files_name_array.push(validName);
		}

		for (var i = 0 ; i < type_three_files_name_length ; i++){
			var validName = type_three_files_name[i].filename.replace("invalid","valid").replace(/\s/g, "-");
			type_three_files_name_array.push(validName);
		}

		for (var i = 0 ; i < 3 ; i++){
			var validName = thumbnail_files_name[i].filename.replace("invalid","valid").replace(/\s/g, "-");
			thumbnail_files_name_array.push(validName);
		}

		console.log(type_one_files_name_array, type_two_files_name_array, type_three_files_name_array, thumbnail_files_name_array);
		
		var tagArray1 = req.body.type_one_tag.replace(/\s/g, "").split(',');
		var tagArray2 = req.body.type_two_tag.replace(/\s/g, "").split(',');
		var tagArray3 = req.body.type_three_tag.replace(/\s/g, "").split(',');

		var newCommition = new Commition({
				time : time,
				user : req.user._id,
				password: password,
				time_spent: time_spent,
				process: process,
				warning: warning,
				etc: etc,
				end_time: end_time,
				slot_full: slot_full,
				slot_open: slot_open,
				type_one: {
					files_name: type_one_files_name_array,
					files_size: type_one_files_size,
					type_desc: type_one_type_desc,
					price: type_one_price,
					tag: tagArray1
				},
				type_two: {
					files_name: type_two_files_name_array,
					files_size: type_two_files_size,
					type_desc: type_two_type_desc,
					price: type_two_price,
					tag: tagArray2
				},
				type_three: {
					files_name: type_three_files_name_array,
					files_size: type_three_files_size,
					type_desc: type_three_type_desc,
					price: type_three_price,
					tag: tagArray3
				},
				thumbnail_files_name: thumbnail_files_name_array
		});

		console.log(newCommition);

		if(req.user.email){
			newCommition.email = req.user.emil
		}else{
			newCommition.twitterId = req.user.twitterId
		}

        Commition.saveCommition(newCommition, function(err, data){
            if (err) { console.log(err); throw err}
            console.log('commition document created');
        });
		
		req.flash('success', '커미션이 성공적으로 등록되었습니다.');
		res.redirect('/');
	}
});

// multer upload settings

var requestStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/request_refer_image')
  },
  filename: function (req, file, cb) {
    cb(null, req.user.nickname +'-'+ req.body.time +'-'+ file.originalname.replace(/\s/g, "-"))
  }
});

var requestPreUpload = multer({ storage: requestStorage});

router.post('/request', requestPreUpload.array('refer_files_name', 9), function(req, res, next) {

	var time 						= req.body.time;
	var to 							= req.body.toUser;
	var ref_commition				= req.body.ref_commition;
	var nickname 					= req.body.nickname;
	var type    					= req.body.type;
	var phone						= req.body.phone;
	var deposit_name     			= req.body.deposit_name;
	var request_desc    			= req.body.request_desc;
	var refer_files_name_array 		= [];

	for (var i = 0 ; i < req.files.length ; i++){
			var filename = req.files[i].filename.replace(/\s/g, "-");
			refer_files_name_array.push(filename);
		}

	var newRequest = new Request({
		time : time,
		from : req.user._id,
		to : to,
		ref_commition : ref_commition,
		type : type,
		phone : phone,
		deposit_name : deposit_name,
		request_desc : request_desc,
		refer_files_name : refer_files_name_array
	});

	console.log(newRequest);

	newRequest.save(function(err, data){
        if (err) { console.log(err); throw err}
        console.log('request document created');
    });

	User.update({_id : to},  { $addToSet: {"requestReceive": newRequest._id}}, function(err,data){
        if (err) return next(err);
        User.update({_id : req.user._id},  { $addToSet: {"requestSend": newRequest._id}}, function(err,data){
            if (err) return next(err);
        });
    });

	req.flash('success', '성공적으로 신청하였습니다.');
	res.redirect('back');
});


module.exports = router;
