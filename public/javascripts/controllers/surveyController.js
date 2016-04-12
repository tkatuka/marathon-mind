app.controller('surveyController', ['$scope', '$http', '$window', 'UsersAPI', function($scope, $http, $window, UsersAPI) {
  $scope.user = null
  $scope.testBegin = 0;
  $scope.test = 2
  $scope.survey = [
    {
      question: "To look leaner",
      type: "Weight"
    },
    {
      question: "To beat someone I've never beaten before",
      type: "Competition"
    },
    {
      question: "To earn respect of peers",
      type: "Respect"
    },
    {
      question: "To try to run faster",
      type: "PGA"
    },
    {
      question: "To meet people",
      type: "Social"
    },
    {
      question: "To improve my sense of self-worth",
      type: "Self-Esteem"
    },
    {
      question: "To concentrate on my thoughts",
      type: "Coping"
    },
    {
      question: "To prevent illness",
      type: "Health"
    },
    {
      question: "To make my life more complete",
      type: "Meaning"
    },
    {
      question: "To have time alone to sort things out",
      type: "Coping"
    },
    {
      question: "To feel more confident about myself",
      type: "Self-Esteem"
    },
    {
      question: "To feel at peace with the world",
      type: "Meaning"
    },
    {
      question: "To prolong my life",
      type: "Health"
    },
    {
      question: "To help control my weight",
      type: "Weight"
    },
    {
      question: "To socialize with other runners",
      type: "Social"
    },
    {
      question: "People look up to me",
      type: "Respect"
    },
    {
      question: "To get a faster time than my friends",
      type: "Competition"
    },
    {
      question: "To improve my running speed",
      type: "PGA"
    }
  ]

  UsersAPI.getMe().success(function(data){
    console.log(data)
    $scope.user = data
  });

  $scope.next = function(index){
    $scope.testBegin = $scope.testBegin + 3;
    $scope.test = index + 3

    if ($scope.test > $scope.survey.length - 1) {
      $scope.test = $scope.survey.length - 1;
    }
  };

  $scope.submit = function() {
    for (i=0; i < $scope.survey.length; i++) {
      if ($scope.survey[i].response === "1") {
        $scope.survey[i].response = 1;
      }
      else if ($scope.survey[i].response === "2") {
        $scope.survey[i].response = 2;
      }
      else if ($scope.survey[i].response === "3") {
        $scope.survey[i].response = 3;
      }
      else if ($scope.survey[i].response === "4") {
        $scope.survey[i].response = 4;
      }
      else if ($scope.survey[i].response === "5") {
        $scope.survey[i].response = 5;
      }
      else if ($scope.survey[i].response === "6") {
        $scope.survey[i].response = 6;
      }
      else {
        $scope.survey[i].response = 7;
      }
    }
    $scope.user.account.results = $scope.survey;
    UsersAPI.postResponse($scope.user).success(function(data){
      $window.location.href = '/home'
    })
  }

  $scope.checkDisable = function(index) {
    if ($scope.survey[index].response) {
      return false;
    }
  }
}]);
