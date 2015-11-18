var express = require('express');
var urlencode = require('urlencode');
var router = express.Router();

var Commition = require('../models/commition');
var User = require('../models/user');


router.get('/new', function(req, res, next) {
  Commition.find({}).sort({'time' : -1}).limit(10).exec(function(err, commitions) {
    if(err){
      console.log(err);
    }
    var options = {
      commitions : commitions,
      align : 'new',
      newActive : 'active',
      lastValue : commitions[commitions.length-1].time,
      moreLoad : (commitions.length > 10 ? true : false),
      isIndex : true
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
      viewActive : 'active',
      lastValue : commitions[commitions.length-1].view,
      moreLoad : (commitions.length > 10 ? true : false),
      isIndex : true
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
      duedateActive : 'active',
      lastValue : commitions[commitions.length-1].end_time,
      moreLoad : (commitions.length > 10 ? true : false),
      isIndex : true
    }
    res.render('index', options);
  });
});

router.post('/keyword', function(req, res, next) {
    res.redirect("/search/"+urlencode(req.body.keyword)+"/new");
  });

router.get('/:keyword/new/', function(req, res, next) {
  var keyword = urlencode.decode(req.params.keyword).split(' ');
  var regExpression = "(";
  for(var i = 0 ; i < keyword.length ; i++){
    regExpression += keyword[i];

    if( i != keyword.length-1){
      regExpression += "|";
    }
  }
  regExpression += ')';
  console.log(regExpression);
  var re = new RegExp(regExpression, "g");

  Commition.find()
    .populate({path: 'user', match: {$or : [{ nickname : re}, { email : re} ]}})
    .sort({'time' : -1}).limit(10).exec(function(err, commitions) {
      if(err){
        console.log(err);
      }
      commitions = commitions.filter(function(doc){
          if( doc.user != null || re.test(doc.title) || re.test(doc.type_one.tag) || re.test(doc.type_two.tag) || re.test(doc.type_three.tag)){
            return true;
          } else {
            return false;
          }
      });

      console.log("======================================")
      console.log("Query result :"+ commitions);

      if(commitions.length == 0){

        console.log("There is no result");
        var options = {
                  commitions : commitions,
                  align : 'new',
                  newActive : true,
                  lastValue : 0,
                  moreLoad : false,
                  keyword : keyword,
                  urlKeyword : req.params.keyword,
                  isIndex : true
                }
        res.render('index', options);
      } else{
        var options = {
          commitions : commitions,
          align : 'new',
          newActive : true,
          lastValue : commitions[commitions.length-1].time || 0,
          moreLoad : (commitions.length > 10 ? true : false),
          keyword : keyword,
          urlKeyword : req.params.keyword,
          isIndex : true
        }
        res.render('results', options);
      }
    });
});

router.get('/:keyword/view/', function(req, res, next) {
  var keyword = urlencode.decode(req.params.keyword).split(' ');
  var regExpression = "(";
  for(var i = 0 ; i < keyword.length ; i++){
    regExpression += keyword[i];

    if( i != keyword.length-1){
      regExpression += "|";
    }
  }
  regExpression += ')';
  console.log(regExpression);
  var re = new RegExp(regExpression, "g");

  Commition.find()
    .populate({path: 'user', match: {$or : [{ nickname : re}, { email : re} ]}})
    .sort({'view' : -1}).limit(10).exec(function(err, commitions) {
      if(err){
        console.log(err);
      }
      commitions = commitions.filter(function(doc){
          if( doc.user != null || re.test(doc.title) || re.test(doc.type_one.tag) || re.test(doc.type_two.tag) || re.test(doc.type_three.tag)){
            return true;
          } else {
            return false;
          }
      });

      console.log("======================================")
      console.log("Query result :"+ commitions);

      if(commitions.length == 0){

        console.log("There is no result");
        var options = {
                  commitions : commitions,
                  align : 'view',
                  viewActive : true,
                  lastValue : 0,
                  moreLoad : false,
                  keyword : keyword,
                  urlKeyword : req.params.keyword,
                  isIndex : true
                }
        res.render('index', options);
      } else{
        var options = {
          commitions : commitions,
          align : 'view',
          viewActive : true,
          lastValue : commitions[commitions.length-1].time || 0,
          moreLoad : (commitions.length > 10 ? true : false),
          keyword : keyword,
          urlKeyword : req.params.keyword,
          isIndex : true
        }
        res.render('results', options);
      }
    });
});

router.get('/:keyword/duedate/', function(req, res, next) {
  var keyword = urlencode.decode(req.params.keyword).split(' ');
  var regExpression = "(";
  for(var i = 0 ; i < keyword.length ; i++){
    regExpression += keyword[i];

    if( i != keyword.length-1){
      regExpression += "|";
    }
  }
  regExpression += ')';
  console.log(regExpression);
  var re = new RegExp(regExpression, "g");

  Commition.find()
    .populate({path: 'user', match: {$or : [{ nickname : re}, { email : re} ]}})
    .sort({'end_time' : 1}).limit(10).exec(function(err, commitions) {
      if(err){
        console.log(err);
      }
      commitions = commitions.filter(function(doc){
          if( doc.user != null || re.test(doc.title) || re.test(doc.type_one.tag) || re.test(doc.type_two.tag) || re.test(doc.type_three.tag)){
            return true;
          } else {
            return false;
          }
      });

      console.log("======================================")
      console.log("Query result :"+ commitions);

      if(commitions.length == 0){

        console.log("There is no result");
        var options = {
                  commitions : commitions,
                  align : 'duedate',
                  duedateActive : true,
                  lastValue : 0,
                  moreLoad : false,
                  keyword : keyword,
                  urlKeyword : req.params.keyword,
                  isIndex : true
                }
        res.render('index', options);
      } else{
        var options = {
          commitions : commitions,
          align : 'duedate',
          duedateActive : true,
          lastValue : commitions[commitions.length-1].time || 0,
          moreLoad : (commitions.length > 10 ? true : false),
          keyword : keyword,
          urlKeyword : req.params.keyword,
          isIndex : true
        }
        res.render('results', options);
      }
    });
});

module.exports = router;
