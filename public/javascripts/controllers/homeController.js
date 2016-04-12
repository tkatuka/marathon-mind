app.controller('homeController', ['$scope', '$http', 'UsersAPI', function($scope, $http, UsersAPI){
    $scope.user = null;
    $scope.myCluster = null;
    $scope.series = ["A", "B"];
    $scope.colors = [
        {
            fillColor: 'rgba(247, 70, 74, 0.2)',
            strokeColor: 'rgba(247, 70, 74, .5)',
            pointColor: 'rgba(247, 70, 74, .5)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(247, 70, 74, .5)'
        },
        {
            fillColor: 'rgba(151, 187, 205, 0.2)',
            strokeColor: 'rgba(151, 187, 205, .5)',
            pointColor: 'rgba(151, 187, 205, 0.5)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(151, 187, 205, 0.5)'
        }
    ]
    $scope.labels =["Competition", "Personal Goal Achievement", "Psychological Coping", "Self-esteem", "Life Meaning", "Health Orientation", "Weight Concern", "Recognition", "Affiliation"];
    $scope.clusters = [
        {
            type: "Running Enthusiast",
            scores: [4.46, 5.8, 4.85, 5.84, 4.82, 6.10, 5.37, 4.37, 4.69],
            info: "On the Motivation of Marothoners Scale, Running Enthusiasts endorse all 9 motivation types. Running Enthusiasts are more likely to run with other runners and participate in marathons.  Running Enthusiasts account for 16% of tested marathoners and are dispraportionately older females."
        },
        {
            type: "Lifestyle Manager",
            scores: [ 2.19, 4.64, 4.66, 5.29, 4.14, 5.56, 5, 2.87, 2.46 ],
            info: "On the Motivation of Marothoners Scale, Lifestyle Managers are most motivated by Personal Goal Achievement, Self-esteem, Health Orientation, Psychological Coping, Weight Concern, and Life Meaning. Lifestyle Managers are more likely to train alone and less likely to train twice in one day.  Typically Lifestyle Managers run fewer miles, and train less often during the week.  Lifestyle Managers account for 25% of tested marathoners, with most falling in this group being female."
        },
        {
            type: "Personal Goal Achiever",
            scores: [ 2.08, 3.96, 1.5, 3.26, 1.6, 2.7, 1.86, 2.02, 2.13 ],
            motivation: "Personal Goal Achievement",
            info: "On the Motivation of Marothoners Scale, Personal Goal Achievers are most motivated by Personal Goal Achievement.  Personal Goal Achievers typically record faster marathon times, and report longer distance runs during training.  Personal Goal Achievers account for 12% of tested marathoners and are typically younger males."
        },
        {
            type: "Personal Accomplisher",
            scores: [ 2.31, 4.46, 2.72, 4.04, 2.34, 4.91, 3.82, 2.39, 2.5 ],
            info: "On the Motivation of Marothoners Scale, Personal Accomplishers are most motivated by Personal Goal Achievement, Self-esteem, and Health Orientation.  Personal Goal Achievers rated near the middle in most aspects of running motivation.  This group is the most common group among runners, accounting for 28% of tested marathoners.  Personal Accomplishers are typically male."
        },
        {
            type: "Competitive Achiever",
            scores: [ 3.99, 5.53, 3.71, 5.4, 4.03, 4.55, 2.7, 3.91, 3.92 ],
            info: "On the Motivation of Marothoners Scale, Lifestyle Managers are most motivated by Personal Goal Achievement, Self-esteem, Health Orientation, Competition, and Life Meaning.  Competitive Achievers typically report faster marathon times, training more days during the week, and are more likely to train twice in one day.  This group accounts for 17% of tested marathoners, with most falling in this category being younger males."
        }
    ]; 
    $scope.data = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
     UsersAPI.getMe().success(function(data){
        console.log(data)
        $scope.user = data
        for (i = 0; i < $scope.clusters.length - 1; i++) {
            if (data.account.rawScores.cluster === $scope.clusters[i].type) {
                $scope.myCluster = $scope.clusters[i];
                break;
            }
        }
        $scope.data = [
            [data.account.rawScores.competition, 
            data.account.rawScores.pga,
            data.account.rawScores.coping,
            data.account.rawScores.selfEsteem,
            data.account.rawScores.meaning,
            data.account.rawScores.health,
            data.account.rawScores.weight,
            data.account.rawScores.respect,
            data.account.rawScores.social],
            $scope.myCluster.scores
        ];
        $scope.series = ["Me", $scope.myCluster.type]
        console.log($scope.data)
    });
}]);
