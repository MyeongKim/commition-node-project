var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('submit');
});

router.get('/sample', function(req, res, next) {
  res.render('sample');
});

module.exports = router;
