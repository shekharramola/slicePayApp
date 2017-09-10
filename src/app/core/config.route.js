
/*Author: Shekhar Ramola*/

(function () {
    'use strict';

    angular.module('app')
        .config(['$routeProvider', '$httpProvider', 
        function($routeProvider, $httpProvider) {
            $routeProvider
               .when('/', {templateUrl: '/app/layout/views/home.html'})
               .when('/home', {templateUrl: '/app/layout/views/home.html'})

               

        }]
    )
    .run(function($rootScope) {
            $rootScope.$on( "$routeChangeStart", function(event, next) {
               
            });
    });

})(); 
