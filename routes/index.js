var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/auth', function(req, res) {
	res.sendfile('./public/auth.html');
});

router.get('/newProfile', function(req, res) {
	res.sendfile('./public/newProfile.html');
});

router.get('/demographics', ensureAuthenticated, function(req, res) {
	res.sendfile('./public/demographics.html');
});

router.get('/trainingInfo', ensureAuthenticated, function(req, res) {
	res.sendfile('./public/trainingInfo.html');
});

router.get('/survey', untakenSurvey, function(req,res) {
	res.sendfile('./public/survey.html');
});

router.get('/motivation', ensureAuthenticated, function(req,res) {
	console.log("In /motivation route");
	res.sendfile('./public/motivation.html');
});

router.get('/home', ensureAuthenticated, function(req,res) {
	console.log("In /home route");
	res.sendfile('./public/home.html');
});

router.get('/data', isAdmin, function(req,res) {
	res.sendfile('./public/data.html');
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
res.redirect('/')
}

function untakenSurvey(req, res, next) {
	if (req.isAuthenticated() && req.user.account.testTaken === false) { return next();}
	if (req.isAuthenticated() && req.user.account.testTaken === true) { return res.redirect('/home')}
		res.redirect('/')
}

function isAdmin(req, res, next) {
	if (req.isAuthenticated() && req.user.account.admin === true) { return next();}
	if (req.isAuthenticated() && req.user.account.admin === false) { return res.redirect('/home')}
		res.redirect('/')
}

module.exports = router;
