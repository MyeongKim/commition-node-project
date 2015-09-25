var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment');

var Commition = require('../models/commition');

String.prototype.toObjectId = function() {
  var ObjectId = (require('mongoose').Types.ObjectId);
  return new ObjectId(this.toString());
};

router.get('/:id', function(req, res, next) {
	var paramId = req.params.id;
	Commition
		.findById(paramId.toObjectId())
		.populate('user')
		.exec(function (err, commition) {
			if (err) return handleError(err);
			var options = {
				commition : commition,
				user : commition.user,
				helpers: {
	            	isSingle: function (array) { 
	            		if (array.length === 1){
							return 'single-target'; 
	            		}else {
	            			return 'slider-target'; 
	            		}
	            		
	            	},
	            	endTime: function(){
	            		return moment(commition.end_time).format('YYYY-DD-MM');
	            	}
	       		}
			};
			res.render('detail', options);
		});
});

module.exports = router;
