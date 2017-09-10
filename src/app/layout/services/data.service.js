
/*Author: Shekhar Ramola*/

(function () {
 	"use strict";
angular.module('app').factory('DataService', ['$http','$location',
	function($http,$location) {

		    var self = this;
				return{
				getQuestions : function() {
            var promise= $http.get('/home').then(function(resp){
               return resp.data;
            });
            return promise;
         },
				

			   submit : function(form, files) {
         var promise =  $http({
          method: 'POST',
          url: '/home', 
            /*IMPORTANT!!! You might think this should be set to 'multipart/form-data' 
             but this is not true because when we are sending up files the request 
             needs to include a 'boundary' parameter which identifies the boundary 
             name between parts in this multi-part request and setting the Content-type 
            manually will not set this boundary parameter. For whatever reason, 
            setting the Content-type to 'false' will force the request to automatically
             populate the headers properly including the boundary parameter.*/
          headers:{
          	'contentType': false
          }  ,  
           transformRequest: function (data) {
                var formData = new FormData();
                //need to convert our json object to a string version of json otherwise
                // the browser will do a 'toString()' on the object which will result 
                // in the value '[Object object]' on the server.
                formData.append("form", angular.toJson(data.form));
                //now add all of the assigned files
                for (var i = 0; i < data.files; i++) {
                    //add each file to the form data and iteratively name them
                    formData.append("file" + i, data.files[i]);
                }
                return form;
            }, 
            data: { form: form, files: files }
          
        }).then(function(resp){
          return resp;     
        }); 
      return promise;
        }, 		

	}
	  
}]);
})(); 

