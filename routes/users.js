var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register',{
	'title': 'Register'
  });
});

router.get('/login', function(req, res, next) {
  res.render('login',{
	'title': 'Login'
  });
});

router.post('/register',function(req, res, next){
	// Get Form Values
	var email = req.body.email;
	var nickname = req.body.nickname;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Form Validation
	req.checkBody('email','Email field is required').notEmpty();
	req.checkBody('email','Email not valid').isEmail();
	req.checkBody('nickname','nickname field is required').notEmpty();
	req.checkBody('password','Password field is required').notEmpty();
	req.checkBody('password2','Passwords do not match').equals(req.body.password);

	// Check for errors
	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors: errors,
			email: email,
			nickname: nickname,
			password: password,
			password2: password2
		});
	} else {
		var newUser = new User({
			email: email,
			nickname: nickname,
			password: password,
		});

			// Create User
	User.createUser(newUser, function(err, user){
		if (err) throw err;
		console.log(user);
	});
		// Success Message
		req.flash('success','You are now registered and may log in');

		res.location('/');
		res.redirect('/');
	}
});

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);	
});

passport.use(new LocalStrategy({
		usernameField: 'email'
	},
	function(username, password, done){
		console.log(username, password);
		User.getUserByEmail(username, function(err, user){
			if(err) throw err;
			if(!user){
				console.log('Unknown User');
				console.log('username');
				return done(null, false,{message: 'Unknown User'});
			}

			User.comparePassword(password, user.password, function(err, isMatch){
				if(err) throw err;
				if(isMatch){
					console.log("adsfsadf");
					return done(null, user);
				} else {
					console.log('Invalid Password');
					return done(null, false, {message:'Invalid Password'});
				}
			});
		});
	}
));

passport.use(new TwitterStrategy({
	consumerKey: 'iLE5MMmOwR90BlejYeyeUtxRT',
	consumerSecret: 'CMfbxk0mPeK9fz3omhqpbwrHFCeRq98dLkDuV4ftYy0Mahuthr',
	callbackURL: "http://127.0.0.1:3000/user/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
	User.findOne({ twitterId : profile.id }, function (err, user) {
			if (err) { console.log(err); return done(err) }
			if (!user) {
				console.log(profile);
				user = new User({
					twitterId : profile.id,
					nickname : profile.displayName
				});
				user.save(function (err) {
					if (err) console.log(err);
					return done(err, user)
				});
			}
			else {
				return done(err, user)
			}
		});
  }
));

router.post('/login', passport.authenticate('local',{failureRedirect:'/user/login', failureFlash:'Invalid nickname or password'}), function(req, res){
	console.log('Authentication Successful');
	req.flash('success', 'You are logged in');
	res.redirect('/');
});

router.get('/auth/twitter',
	passport.authenticate('twitter'));

router.get('/auth/twitter/callback', 
	passport.authenticate('twitter', { failureRedirect: '/user/login' }),
	function(req, res) {
		req.flash('success', 'You are logged in');
		res.redirect('/');
	});



// Log User Out
router.get('/logout', function(req, res){
	req.logout();
	// Success Message
	req.flash('success', "You have logged out");
	res.redirect('/');
});

module.exports = router;
