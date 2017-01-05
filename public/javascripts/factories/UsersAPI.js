app.factory('UsersAPI', function($http){
	var API_ROOT = 'user';
	return {
		getMe: function(){
			return $http({
				url: API_ROOT + '/me',
				method: 'GET'
			})
		},
		getAll: function(){
			return $http({
				url: API_ROOT + '/all',
				method: 'GET'
			})
		},
		postResponse: function(user) {
			console.log("posting response");
			return $http({
				url: API_ROOT + '/'+ user._id + '/survey',
				method: 'PUT',
				data: user
			})
		},
		postDemographics: function(user) {
			console.log("posting demos");
			return $http({
				url: API_ROOT + '/' + user._id + '/demographics',
				method: 'PUT',
				data: user
			})
		},
		postTrainingInfo: function(user) {
			return $http({
				url: API_ROOT + '/' + user._id + '/trainingInfo',
				method: 'PUT',
				data: user
			});
		},
		postMe: function(user) {
			console.log("in postMe UsersAPI");
			console.log(user);
			return $http({
				url: API_ROOT + '/me',
				method: 'POST',
				data: user
			})
		},
		makeAdmin: function(id) {
			return $http({
				url: API_ROOT + '/' + id + '/makeAdmin',
				method: 'PUT'
			})
		},
		removeAdmin: function(id) {
			return $http({
				url: API_ROOT + '/' + id + '/removeAdmin',
				method: 'PUT'
			})
		}
	}
});
