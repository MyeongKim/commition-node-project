var express = require('express');
var router = express.Router();

var Commition = require('../models/commition');

router.get('/new', function(req, res, next) {
  Commition.find({}, function(err, commitions){
  	if(err){
  		console.log(err);
  	}
  	var model = {
  		commitions : commitions
  	}
  	res.render('index', model);
  });
});

router.get('/view', function(req, res, next) {
  res.render('index');
});

router.get('/duedate', function(req, res, next) {
  res.render('index');
});

module.exports = router;
