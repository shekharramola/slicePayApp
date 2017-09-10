
(function () {
  "use strict";
    angular.module('app').service('Repository', function Repository() {
    this.data = [];
    
    this.getData = function() {
        return this.data;
    };
    
    this.setData = function(data) {
        this.data = data;
    };    
   
    this.getAll = function() {
        return this.getData();
    };

     this.newId = function() {
        var currentIds = $.map(this.getData(), function(entity) { return entity.id; });
        var maxId = Math.max.apply(Math, currentIds);
        return maxId + 1;
    };
    
   
    this.create = function(entity) {
        var newId = this.newId();
        // entity.id = newId;
        this.data.push(entity);
        return entity;
    };
    

});

}());