var BigNumber = require('bignumber.js');

angular.module('ethExplorer')
    .controller('chainInfosCtrl', function ($rootScope, $scope, $location, $routeParams, $q) {

        $scope.init=function()
        {
            getChainInfos()
                .then(function(result){



                });

            function getChainInfos(){
                var deferred = $q.defer();
                deferred.resolve(0); // dummy value 0, for now. // see blockInfosController.js
                return deferred.promise;
            }
        };
        $scope.init();
        console.log($scope.result);

});
