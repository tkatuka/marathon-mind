app.controller('dataController', ['$scope', '$http', 'UsersAPI', function($scope, $http, UsersAPI){
    $scope.users = null;
    $scope.searchText = "";
    $scope.data = [[0, 0, 0, 0, 0, 0, 0, 0, 0]];
    $scope.labels =["Competition", "Personal Goal Achievement", "Psychological Coping", "Self-esteem", "Life Meaning", "Health Orientation", "Weight Concern", "Recognition", "Affiliation"];
    $scope.pieData = [0,0]
    $scope.pieLabels = ["Male", "Female"]
    $scope.barLabels = ['Half-marathons', 'Marathons', 'Ultra-marathons']
    $scope.barData= [[0, 0, 0]]
    $scope.me = null;
    UsersAPI.getMe().success(function(data){
        $scope.me = data
        
    });
     UsersAPI.getAll().success(function(data){
        console.log(data)
        $scope.users = data
        $scope.currentPage = 1;
        $scope.numPerPage = 5;
        $scope.totalItems = $scope.users.length;
        $scope.maxPage = Math.ceil($scope.totalItems/$scope.numPerPage)
        
        var comp=0; pga=0; coping=0; esteem=0; meaning=0; health=0; weight=0; respect=0; social=0; 
        var male=0; female=0;
        var marathons=0; halfs=0; ultras=0;
        for (i = 0; i < data.length - 1; i++) {
            comp += data[i].account.rawScores.competition;
            pga += data[i].account.rawScores.pga;
            coping += data[i].account.rawScores.coping;
            esteem += data[i].account.rawScores.selfEsteem;
            meaning += data[i].account.rawScores.meaning;
            health += data[i].account.rawScores.health;
            weight += data[i].account.rawScores.weight;
            respect += data[i].account.rawScores.respect;
            social += data[i].account.rawScores.social;
            marathons += data[i].training.marathonsRun;
            halfs += data[i].training.halfMarathonsRun;
            ultras += data[i].training.ultraMarathonsRun;
            if (data[i].demographics.sex === "Male") {
                male +=1;
            }
            else {
                female += 1
            }
        }
        $scope.data = [[comp/data.length, pga/data.length, coping/data.length, esteem/data.length, meaning/data.length,
         health/data.length, weight/data.length, respect/data.length, social/data.length]];
         $scope.pieData = [male, female];
         $scope.barData = [[halfs/data.length, marathons/data.length, ultras/data.length]]
    });
  
    $scope.paginate = function(value) {
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.numPerPage;
        end = begin + $scope.numPerPage;
        index = $scope.users.indexOf(value);
        return (begin <= index && index < end);
    }; 
    
    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };
    
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.users.length - 1) {
            $scope.currentPage++;
        }
    };

     $scope.exportData = function () {
        var blob = new Blob([document.getElementById('exportable').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "MOMS.xls");
    };

    $scope.makeAdmin = function(user) {
        UsersAPI.makeAdmin(user._id).success(function(data){
            index = $scope.users.indexOf(user);
            $scope.users[index] = data;
        });
    }

    $scope.removeAdmin = function(user) {
        UsersAPI.removeAdmin(user._id).success(function(data){
            index = $scope.users.indexOf(user);
            $scope.users[index] = data;
        });
    }
}]);
