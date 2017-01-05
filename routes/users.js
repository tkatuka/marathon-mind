var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

router.param('_id', function(req, res, next, id) {
  var query = User.findById(id);
  query.exec(function (err, editUser){
    if (err) { return next(err); }
    if (!editUser) { return next(new Error("can't find user")); }
    req.editUser = editUser;
    return next();
  });
});

router.get('/me', function(req, res, next) {
 console.log("in /me routes");
 console.log(req.user);
 res.send(req.user);
});

router.get('/all', function(req, res, next) {
	User.find(function(err, users){
		if(err) {return next(err);}
		res.send(users);
	}); 
});

router.put('/:_id/survey', function(req, res, next){
	console.log("id/survey route");
	console.log(req.body);
	req.editUser.generateResults(req.body, function(err, user){
		if (err) 
		{
		   console.log("error");
		   return next(err);
		}
		req.user.account = req.body.account;
		res.json(user)
	});
});

router.put('/:_id/demographics', function(req, res) {
	console.log("id/demographics");
	console.log(req.body);
	User.findOne({_id: req.body._id}, function(err, user) {
		if(err){
		  console(err);
		}
		user.demographics = req.body.demographics;
		user.save(function(err) { 
		   if(err) { console.log("Error while updating demographics"); } 
		   else { res.json(user);}
		});
	});	
});

router.put('/:_id/trainingInfo', function(req, res) {
	console.log(req.body);
	User.findOne({_id: req.body._id}, function(err, user) {
		if(err){
		  console(err);
		}
		user.training = req.body.training ;
		user.save(function(err) { 
		   if(err) { console.log("Error while updating training info"); } 
		   else { res.json(user);}
		});
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
	console.log("IN post /me: " + req.body);
	fullName = req.body.account.first + ' ' + req.body.account.last
	console.log("The fullName is: " + fullName);
	console.log(req.body.account.password);
	user = new User({
	    	account: {
	        email: req.body.account.email,
	        name: fullName,
	        pleaseNotify: req.body.account.pleaseNotify
	      },
	      demographics: req.body.demographics, 
	      training: req.body.training,
	});
	user.account.password = user.generateHash(req.body.account.password);
	console.log("the password is " + user.account.password)
	user.save(function (err) {
		if (err) {console.log(err)}
		res.json(user)
	})
	
});
module.exports = router;
