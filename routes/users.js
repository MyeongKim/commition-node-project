var express = require('express');
var router = express.Router();
var passport = require('passport');
var async = require('async');
var crypto = require('crypto');
var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');

var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register',{
	'active_register': true
  });
});

router.get('/login', function(req, res, next) {
  res.render('login',{
	'active_login': true
  });
});

router.get('/forgot', function(req, res, next) {
  res.render('forgot');
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
	res.redirect('back');
});

router.get('/auth/twitter',
	passport.authenticate('twitter'));

router.get('/auth/twitter/callback', 
	passport.authenticate('twitter', { failureRedirect: '/user/login' }),
	function(req, res) {
		req.flash('success', 'You are logged in');
		res.redirect('/');
	});

router.post('/forgot', function(req, res, next) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if (!user) {
                    req.flash('error', '이메일 주소가 올바르지 않습니다.');
                    return res.redirect('/user/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'ming3772@gmail.com',
                    pass: "I'llgotoyou"
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'passwordreset@demo.com',
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/user/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/user/forgot');
    });
});

router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/user/forgot');
        }
        res.render('reset', {
            user: req.user
        });
    });
});

router.post('/reset/:token', function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }

                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

				bcrypt.hash(user.password, 10, function(err, hash){
					if(err) throw err;
					// Set hashed pw
					user.password = hash;
					// Create User
	                user.save(function(err) {
                    	req.logIn(user, function(err) {
                        done(err, user);
                    	});
                	});
				});
            });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'ming3772@gmail.com',
                    pass: "I'llgotoyou"
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'passwordreset@demo.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('success', '비밀번호를 안전하게 변경하였습니다!');
                done(err);
            });
        }
    ], function(err) {
        res.redirect('/');
    });
});

// Log User Out
router.get('/logout', function(req, res){
	req.logout();
	// Success Message
	req.flash('success', "You have logged out");
	res.redirect('/');
});

module.exports = router;
