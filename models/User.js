var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var clusterMagic = require('clusterfck')
var UserSchema = new mongoose.Schema({
  account: {
    name: String,
    email: String,
    password: String,
    pleaseNotify: Boolean,
    admin: {type: Boolean, default: false},
    testTaken: {type: Boolean, default: false},
    results: {type: Object, default: null},
    rawScores: {
        competition: {type: Number, default: 0},
        weight: {type: Number, default: 0},
        respect: {type: Number, default: 0},
        pga: {type: Number, default: 0},
        social: {type: Number, default: 0},
        selfEsteem: {type: Number, default: 0},
        coping: {type: Number, default: 0},
        health: {type: Number, default: 0},
        meaning: {type: Number, default: 0},
        cluster: {type: String, default: null}
    }
  },
  demographics: {
    sex: String,
    age: Number,
    ethnicity: String,
    maritalStatus: String,
    height: Number,
    weight: Number
  },
  training: {
    milesPerWeek: Number,
    daysPerWeek: Number,
    yearsRunning: Number,
    longestTrainingRun: Number,
    timeTrainingAlone: Number,
    trainTwicePerDay: Boolean,
    halfMarathonsRun: Number,
    marathonsRun: Number, 
    ultraMarathonsRun: Number,
    fastestMarathonHours: Number,
    fastestMarathonMinutes: Number,
    fastestMarathonSeconds: Number,
    runningRelatedInjury: Boolean,
    trainedWhileInjured: Boolean
  }
});

var clusterNames = ["Running Enthusiast", "Lifestyle Manager", "Goal Achiever", "Personal Accomplisher", "Competitive Achiever"]

var centroids = [ 
    [ 4.46, 5.8, 4.85, 5.84, 4.82, 6.10, 5.37, 4.37, 4.69 ], 
    [ 2.19, 4.64, 4.66, 5.29, 4.14, 5.56, 5, 2.87, 2.46 ], 
    [ 2.08, 3.96, 1.5, 3.26, 1.6, 2.7, 1.86, 2.02, 2.13 ],
    [ 2.31, 4.46, 2.72, 4.04, 2.34, 4.91, 3.82, 2.39, 2.5 ],
    [ 3.99, 5.53, 3.71, 5.4, 4.03, 4.55, 2.7, 3.91, 3.92 ]
];

var kmeans = new clusterMagic.Kmeans(centroids);

UserSchema.methods.generateHash = function(password) {
    console.log("prehash=" + password);
    salt = bcrypt.genSaltSync(10);
    console.log(salt)
    var hash = bcrypt.hashSync(password, salt);
    console.log(hash)
    return hash;
};

// checking if password is valid
UserSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.account.password);
};

UserSchema.methods.generateResults = function(user, cb){
    this.account.results = user.account.results;
    this.account.testTaken = true;
    for (i=0; i < this.account.results.length; i++) {
        if (this.account.results[i].type === "Weight") {
            this.account.rawScores.weight += this.account.results[i].response;
        }
        else if (this.account.results[i].type === "Competition") {
            this.account.rawScores.competition += this.account.results[i].response;
        }
        else if (this.account.results[i].type === "Health") {
            this.account.rawScores.health += this.account.results[i].response;
        }
        else if (this.account.results[i].type === "Meaning") {
            this.account.rawScores.meaning += this.account.results[i].response;
        }
        else if (this.account.results[i].type === "Self-Esteem") {
            this.account.rawScores.selfEsteem += this.account.results[i].response;
        }
        else if (this.account.results[i].type === "Social") {
            this.account.rawScores.social += this.account.results[i].response;
        }
        else if (this.account.results[i].type === "PGA") {
            this.account.rawScores.pga += this.account.results[i].response;
        }
        else if (this.account.results[i].type === "Respect") {
            this.account.rawScores.respect += this.account.results[i].response;
        }
        else {
            this.account.rawScores.coping += this.account.results[i].response;
        }
    };
    this.account.rawScores.coping /= 2;
    this.account.rawScores.respect /= 2;
    this.account.rawScores.pga /= 2;
    this.account.rawScores.social /= 2;
    this.account.rawScores.selfEsteem /= 2;
    this.account.rawScores.meaning /= 2;
    this.account.rawScores.health /= 2;
    this.account.rawScores.competition /= 2;
    this.account.rawScores.weight /= 2;

    clusterIndex = kmeans.classify([this.account.rawScores.competition, this.account.rawScores.pga, this.account.rawScores.coping, this.account.rawScores.selfEsteem, this.account.rawScores.meaning, this.account.rawScores.health, this.account.rawScores.weight, this.account.rawScores.respect, this.account.rawScores.social])
    
    this.account.rawScores.cluster = clusterNames[clusterIndex]
    this.markModified('account');
    this.save(cb);
};

UserSchema.methods.makeAdmin = function(cb) {
    this.account.admin = true;
    this.markModified('account');
    this.save(cb);
};

UserSchema.methods.removeAdmin = function(cb) {
    this.account.admin = false;
    this.markModified('account');
    this.save(cb);
};

UserSchema.set('versionKey', false);
mongoose.model('User', UserSchema, 'Users');
