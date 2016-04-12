var MongoClient = require('mongodb').MongoClient;
  function addObject(collection, object){
      collection.insert(object, function(err, result){
          if(!err) {
              console.log("Inserted : ");
              console.log(result);
          }
    });
}
var bcrypt = require('bcrypt-nodejs');
salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("adminAkoYa", salt);

MongoClient.connect("mongodb://localhost/", function(err, db) {  
  var myDB = db.db("marathoners");
  myDB.dropCollection("Users");
  myDB.createCollection("Users", function(err, Users){ 
    addObject(Users, {
      account: {
        name: "Trenton",
        email: "trenton.daniels@gmail.com",
        password: hash,
        admin: true,
        testTaken: false,
        pleaseNotify: true,
        results: null,
        rawScores: {
          competition: 0,
          weight: 0,
          respect: 0,
          pga: 0,
          social: 0,
          selfEsteem: 0,
          coping: 0,
          health: 0,
          meaning: 0,
          cluster: null
        }
      },
      demographics: {
        sex: "Male",
        age: 25,
        ethnicity: "Caucasian",
        maritalStatus: "Married",
        height: 71,
        weigth: 210
      },
      training: {
        milesPerWeek: 10,
        daysPerWeek: 4,
        yearsRunning: 1,
        longestTrainingRun: 5,
        timeTrainingAlone: 100,
        trainTwicePerDay: false,
        halfMarathonsRun: 0,
        marathonsRun: 0, 
        ultraMarathonsRun: 0,
        fastestMarathonHours: null,
        fastestMarathonMinutes: null,
        fastestMarathonSeconds: null,
        runningRelatedInjury: false,
        trainedWhileInjured: false
      }
    });
  });
  setTimeout(function(){ db.close(); }, 3000);
});

