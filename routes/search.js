var express = require('express');
var router = express.Router();

var Commition = require('../models/commition');

router.get('/new', function(req, res, next) {
  Commition.find({}).sort({'time' : -1}).limit(10).exec(function(err, commitions) {
    if(err){
      console.log(err);
    }
    var options = {
      commitions : commitions,
      align : 'new',
      lastValue : commitions[commitions.length-1].time,
      moreLoad : (commitions.length > 10 ? true : false)
    }
    res.render('index', options);
  });
});

router.get('/view', function(req, res, next) {
  Commition.find({}).sort({'view' : -1}).limit(10).exec(function(err, commitions) {
    if(err){
      console.log(err);
    }
    var options = {
      commitions : commitions,
      align : 'view',
      lastValue : commitions[commitions.length-1].view,
      moreLoad : (commitions.length > 10 ? true : false)
    }
    res.render('index', options);
  });
});

router.get('/duedate', function(req, res, next) {
  Commition.find({}).sort({'end_time' : 1 }).limit(10).exec(function(err, commitions) {
    if(err){
      console.log(err);
    }
    var options = {
      commitions : commitions,
      align : 'duedate',
      lastValue : commitions[commitions.length-1].end_time,
      moreLoad : (commitions.length > 10 ? true : false)
    }
    res.render('index', options);
  });
});

module.exports = router;
