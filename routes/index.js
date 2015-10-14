var express = require('express');
var router = express.Router();

var Commition = require('../models/commition');

String.prototype.toObjectId = function() {
  var ObjectId = (require('mongoose').Types.ObjectId);
  return new ObjectId(this.toString());
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/search/view');
});

router.get('/scroll/new/:lastValue', function(req, res, next) {
	var lastValue = req.params.lastValue;
	Commition.find({time : {$lt : lastValue}}).sort({'time' : -1}).limit(10).exec(function(err, commitions) {
	    if(err){
	      console.log(err);
	    }
	    if(Object.keys(commitions).length !== 0){
	    	var options = {
				commitions : commitions,
				align : 'new',
				lastValue : commitions[commitions.length-1].time,
				layout : false
	  		}
    		res.render('scrollContent', options);
	    }else{
	    	res.end();
	    }
  	});
});

router.get('/scroll/view/:lastValue', function(req, res, next) {
	var lastValue = req.params.lastValue;
	Commition.find({view : {$lt : lastValue}}).sort({'view' : -1}).limit(10).exec(function(err, commitions) {
	    if(err){
	      console.log(err);
	    }
	    if(Object.keys(commitions).length !== 0){
	    	var options = {
				commitions : commitions,
				align : 'view',
				lastValue : commitions[commitions.length-1].view,
				layout : false
	  		}
    		res.render('scrollContent', options);
	    }else{
	    	res.end();
	    }
  	});
});

router.get('/scroll/duedate/:lastValue', function(req, res, next) {
	var lastValue = req.params.lastValue;
	Commition.find({end_time : {$gt : lastValue}}).sort({'end_time' : 1}).limit(10).exec(function(err, commitions) {
	    if(err){
	      console.log(err);
	    }
	    if(Object.keys(commitions).length !== 0){
	    	var options = {
				commitions : commitions,
				align : 'duedate',
				lastValue : commitions[commitions.length-1].end_time,
				layout : false
	  		}
    		res.render('scrollContent', options);
	    }else{
	    	res.end();
	    }
  	});
});
// commition page
router.get('/detail', function(req, res, next) {
  res.render('detail', {logInUser : req.user});
});


module.exports = router;
