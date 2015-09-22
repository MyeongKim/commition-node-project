var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/scroll', function(req, res, next) {
  res.render('scrollContent',{layout : false});
});

// commition page
router.get('/detail', function(req, res, next) {
  res.render('detail');
});


module.exports = router;
