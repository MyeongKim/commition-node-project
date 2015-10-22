var express = require('express');
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

router.post('/keyword', function(req, res, next) {
  var keyword = req.body.keyword;
  var opts = { path: 'user', match: {$or : [{ nickname : new RegExp(keyword, 'i')}, { email : new RegExp(keyword, 'i')} ]}}
    
  Commition.find({})
    .populate(opts)
    .or([{title: new RegExp(keyword, 'i')},
      {email: new RegExp(keyword, 'i')},
      {twitterId: new RegExp(keyword, 'i')},
      {'type_one.tag' : new RegExp(keyword, 'i')},
      {'type_two.tag' : new RegExp(keyword, 'i')},
      {'type_three.tag' : new RegExp(keyword, 'i')}])
    .sort({'time' : -1}).limit(10).exec(function(err, commitions) {
      if(err){
        console.log(err);
      }
      if(commitions.length == 0){
        console.log("There is no result");
        var options = {
          commitions : commitions,
          align : 'new',
          lastValue : 0,
          moreLoad : false,
          keyword : keyword
        }
        res.render('index', options);
      
      } else{
        var options = {
          commitions : commitions,
          align : 'new',
          lastValue : commitions[commitions.length-1].time || 0,
          moreLoad : (commitions.length > 10 ? true : false),
          keyword : keyword
        }
        res.render('index', options);
      }
      
    });
  });

  //   Commition.populate('user').find( {$or : [{title: new RegExp(keyword, 'i')},
  //   {email: new RegExp(keyword, 'i')},
  //   {twitterId: new RegExp(keyword, 'i')},
  //   {'type_one.tag' : new RegExp(keyword, 'i')},
  //   {'type_two.tag' : new RegExp(keyword, 'i')},
  //   {'type_three.tag' : new RegExp(keyword, 'i')},
  //   {'user.nickname' : new RegExp(keyword, 'i')},
  //   {'user.email' : new RegExp(keyword, 'i')},
  //   {'user.twitterId' : new RegExp(keyword, 'i')},


  //   ]})
  //   .sort({'time' : -1}).limit(10).exec(function(err, commitions1) {
  //     if(err){
  //       console.log(err);
  //     }

  //     User.find({nickname : new RegExp(keyword, 'i'), email : new RegExp(keyword, 'i'), twitterId : new RegExp(keyword, 'i')})
  //     .sort({'time' : -1}).limit(10).exec(function(err, commitions2) {
  //       if(err){
  //         console.log(err);
  //       }

  //       var options = {
  //         commitions : commitions1.concat(commitions2),
  //         align : 'new',
  //         lastValue : commitions1[commitions1.length-1].time,
  //         moreLoad : (commitions1.length > 10 ? true : false),
  //         keyword : keyword
  //       }
  //       res.render('index', options);
  //   });
  // });
// });


module.exports = router;
