
(function() {
    'use strict';
angular.module('app').requires.push('ngMockE2E');
angular.module('app').factory('BaseBackend', function($httpBackend) {
    
    var BaseBackend = function(repository, route){
        var scope = this; 
        scope.Repository = repository; 
        scope.route = route;

        $httpBackend.whenGET(/assets\//).passThrough();
        $httpBackend.whenGET(/\.html$/).passThrough();
        $httpBackend.whenGET(/\.js$/).passThrough();

        $httpBackend.whenGET(new RegExp('^\/' + scope.route + '(\\?.*)?$')).respond(function(method, url, data, headers, params) {
            if(!headers.Authorization){
                return [401, [], {}];
            };
            var entities = scope.Repository.getAll();
            return [200, entities, {}];
        });
        
        $httpBackend.whenGET(new RegExp("^\/" + scope.route + "\/\\d+(\\?.*)?$")).respond(function(method, url, data, headers, params) {
            if(!headers.Authorization){
                return [401, {}, {}];
            };
            var urlArray = url.split('/')
            var entityId = urlArray[urlArray.length-1];
            var entityId = urlArray[urlArray.length-1];
            var entity = scope.Repository.getById(entityId);
            return [200, entity, {}];
        });
        
        $httpBackend.whenPOST(new RegExp('^\/' + scope.route + "(\\?.*)?$")).respond(function(method, url, data, headers, params) {
            if(!headers.Authorization){
                return [401, {}, {}];
            };
            var params = angular.fromJson(data);
            var entity = scope.Repository.create(params);
            var entityId = entity.entityId;
            return [201, entity, { Location: '/' + scope.route + '/' + entityId }];
        });

        $httpBackend.whenPUT(new RegExp("^\/" + scope.route + "\/\\d+(\\?.*)?$")).respond(function(method, url, data, headers, params) {
            if(!headers.Authorization){
                return [401, {}, {}];
            };
            var params = angular.fromJson(data);
            var urlArray = url.split('/')
            var entityId = urlArray[urlArray.length-1];
            var entity = scope.Repository.update(entityId, params);
            return [201, entity, { Location: '/' + scope.route + '/' + entityId }];
        });
        
        $httpBackend.whenDELETE(new RegExp("^\/" + scope.route + "\/\\d+(\\?.*)?$")).respond(function(method, url, data, headers, params) {
            if(!headers.Authorization){
                return [401, {}, {}];
            };
            var urlArray = url.split('/')
            var entityId = urlArray[urlArray.length-1];
            scope.Repository.delete(entityId);
            return [204, {}, {}];
        });    
       
        return scope;
      };

      return BaseBackend;
});
})();