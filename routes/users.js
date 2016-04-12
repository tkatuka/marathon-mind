var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

router.param('_id', function(req, res, next, id) {
  var query = User.findById(id);
  query.exec(function (err, editUser){
    if (err) { return next(err); }
    if (!editUser) { return next(new Error("can't find comment")); }
    req.editUser = editUser;
    return next();
  });
});

router.get('/me', function(req, res, next) {
 console.log(req.user)
 res.send(req.user)
});

router.get('/all', function(req, res, next) {
	User.find(function(err, users){
		if(err) {return next(err);}
		res.send(users);
	}); 
});

router.put('/:_id/survey', function(req, res, next){
	req.editUser.generateResults(req.body, function(err, user){
		if (err) {return next(err);}
		req.user.account = req.body.account;
		res.json(user)
	});
});

router.put('/:_id/makeAdmin', function(req, res, next){
	req.editUser.makeAdmin(function(err, user){
		if (err) {return next(err);}
		res.json(user);
	});
});

router.put('/:_id/removeAdmin', function(req, res, next){
	req.editUser.removeAdmin(function(err, user){
		if (err) {return next(err);}
		res.json(user);
	});
});

router.post('/me', function(req, res, next){
	fullName = req.body.account.first + ' ' + req.body.account.last
	console.log(fullName)
	console.log(req.body.password)
	user = new User({
	    	account: {
	        email: req.body.account.email,
	        name: fullName,
	        pleaseNotify: req.body.account.pleaseNotify
	      },
	      demographics: {
	        sex: req.body.demographics.sex,
	        age: req.body.demographics.age,
	        ethnicity: req.body.demographics.race,
	        maritalStatus: req.body.demographics.marritalStatus,
	        height: req.body.demographics.height,
	        weight: req.body.demographics.weight
	      },
	      training: {
	        milesPerWeek: req.body.training.miPerWeek,
	        daysPerWeek: req.body.training.daysPerWeek,
	        yearsRunning: req.body.training.yearsRunning,
	        longestTrainingRun: req.body.training.longestRun,
	        timeTrainingAlone: req.body.training.timeAlone,
	        trainTwicePerDay: req.body.training.twoPerDay,
	        halfMarathonsRun: req.body.training.halfMarathon,
	        marathonsRun: req.body.training.marathon, 
	        ultraMarathonsRun: req.body.training.ultraMarathon,
	        fastestMarathonHours: req.body.training.fastestMarathonHours,
	        fastestMarathonMinutes: req.body.training.fastestMarathonMinutes,
	        fastestMarathonSeconds: req.body.training.fastestMarathonSeconds,
	        runningRelatedInjury: req.body.training.injured,
	        trainedWhileInjured: req.body.training.ranInjured
	      }
	});
	user.account.password = user.generateHash(req.body.account.password);
	console.log("the password is " + user.account.password)
	user.save(function (err) {
		if (err) {console.log(err)}
		res.json(user)
	})
	
});
module.exports = router;
