app.controller('demographicsController', ['$scope', '$http', '$window', 'UsersAPI', function($scope, $http, $window, UsersAPI) {
  $scope.user = null;
  $scope.buttonName = "Submit";

  UsersAPI.getMe().success(function(data){
    console.log("in demographics controller get me");
    console.log(data);
    $scope.user = data;
    if(data.demographics != null)
    {
	$scope.buttonName = "Update";
	$scope.demographicsInfo = angular.copy(data.demographics);
    }
    else
	$scope.buttonName = "Submit";

    if(data.training != null)
    {
	$scope.buttonName = "Update";
	console.log("data training !null");
	$scope.trainingInfo = angular.copy(data.training);	
	if (data.training.trainedWhileInjured === true) {
            $scope.trainingInfo.trainedWhileInjured = "Yes"
        }
        else {
            $scope.trainingInfo.trainedWhileInjured = "No"
        }

       	if (data.training.runningRelatedInjury) {
            $scope.trainingInfo.runningRelatedInjury = "Yes"
        }
        else {
            $scope.trainingInfo.runningRelatedInjury = "No"
        }

        if (data.training.trainTwicePerDay) {
            $scope.trainingInfo.trainTwicePerDay = "Yes"
        }
        else {
            $scope.trainingInfo.trainTwicePerDay = "No"
        }
     }
     else { $scope.buttonName = "Submit"; }	
   });

  $scope.storeDemographics = function(demoInfo) {
	console.log("storing demographics");
	console.log($scope.user);	
	if($scope.user != null){
	   $scope.user.demographics = angular.copy(demoInfo);
	}
     	UsersAPI.postDemographics($scope.user).success(function(data){
	   console.log("user is saved");
	   $scope.user = data;
	   $window.location.href = '/trainingInfo';
    	});
   };  

    $scope.storeTrainingInfo = function(trainingInfo) {
        $scope.user.training = angular.copy(trainingInfo);
	console.log($scope.user.training);

        if ($scope.user.training.trainedWhileInjured === "Yes") {
            $scope.user.training.trainedWhileInjured = true
        }
        else {
            $scope.user.training.trainedWhileInjured = false
        }

        if ($scope.user.training.runningRelatedInjury === "Yes") {
            $scope.user.training.runningRelatedInjury = true
        }
        else {
            $scope.user.training.runningRelatedInjury = false
        }

        if ($scope.user.training.trainTwicePerDay === "Yes") {
            $scope.user.training.trainTwicePerDay = true
        }
        else {
            $scope.user.training.trainTwicePerDay = false
        }
	UsersAPI.postTrainingInfo($scope.user).success(function(data) {
	   console.log("training Info updated");
	   $scope.user = data;
         //console.log($scope.user);
	   $window.location.href = '/home';
	});	
    };
 

}]);
