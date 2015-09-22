var express = require('express');
var router = express.Router();

var Commition = require('../models/commition');

String.prototype.toObjectId = function() {
  var ObjectId = (require('mongoose').Types.ObjectId);
  return new ObjectId(this.toString());
};

router.get('/:id', function(req, res, next) {
	var paramId = req.params.id;
	Commition.findById( paramId.toObjectId(), function(err, commition){
		if(err){
			console.log(err);
		}
		var model = {
			commition : commition
		}
		console.log("time is "+commition.time);
		res.render('detail', model);
	});
});

module.exports = router;
