app.controller('newProfileController', ['$scope', '$http', '$window', 'UsersAPI', function($scope, $http, $window, UsersAPI){
    $scope.user = {
        account: null,
        demographics: null,
        training: null
    }

    $scope.showUserInfo = true;
    $scope.showDemographics = false;
    $scope.showTraining = false;

    $scope.create = function(accountInfo) {

	console.log("in create function");	
	$scope.user.account = angular.copy(accountInfo);
	console.log($scope.user);

        UsersAPI.postMe($scope.user).success(function(data){
            console.log("successfully posted");
	    var params = {
                username: $scope.user.account.email,
                password: $scope.user.account.password
            }

            $http({
                url: '/login',
                method: 'POST',
                data: params
            }).success(function(data){
                $window.location.href = '/home';
            })
        });
    }

    $scope.toDemographics = function(accountInfo) {
        $scope.user.account = angular.copy(accountInfo);
        $scope.showUserInfo = false;
        $scope.showDemographics = true;
    };

    $scope.toTraining = function(demoInfo) {
        $scope.user.demographics = angular.copy(demoInfo);
        console.log($scope.user)
        $scope.showDemographics = false
        $scope.showTraining = true;
    };

    $scope.storeTrainingInfo = function(trainingInfo) {
        $scope.user.training = angular.copy(trainingInfo);

        if ($scope.user.training.injured === "Yes") {
            $scope.user.training.injured = true
        }
        else {
            $scope.user.training.injured = false
        }

        if ($scope.user.training.ranInjured === "Yes") {
            $scope.user.training.ranInjured = true
        }
        else {
            $scope.user.training.ranInjured = false
        }

        if ($scope.user.training.twoPerDay === "Yes") {
            $scope.user.training.twoPerDay = true
        }
        else {
            $scope.user.training.twoPerDay = false
        }
        console.log($scope.user);

        UsersAPI.postMe($scope.user).success(function(data){
            var params = {
                username: $scope.user.account.email,
                password: $scope.user.account.password
            }
            
            $http({
                url: '/login',
                method: 'POST',
                data: params
            }).success(function(data){
                $window.location.href = '/home';
            })
        });
    };
}]);
