
/*Author: Shekhar Ramola*/

(function () {
  "use strict";
angular.module('app')  
.controller('HomeCtrl', ['$scope',  'DataService',  '$location',  
 function($scope,  DataService, $location) {
        $scope.files = [];
       $scope.formData=[];
       var self= this;
       self.form={};
       self.questions= []; 
       self.answers = [];
       self.response = []; 
       self.inputQuestions =[];
       self.uploadQuestions = [];

        //listen for the file selected event
    $scope.$on("fileSelected", function (event, args) {
        $scope.$apply(function () {            
            //add the file object to the scope's files collection
            $scope.files.push(args.file);
            
        });
    });
       
  
      self.applyNow = function() {
      $location.path('/home')
        var promise = DataService.getQuestions().then(function(resp){
        self.response = resp;
        self.questions= self.response[0].selectQuestions;
        self.inputQuestions = self.response[0].inputQuestions;
        self.uploadQuestions= self.response[0].uploadQuestions;

      });
    
     return promise;
    };   
     self.applyNow();

      
    self.submit = function(formData){  
      self.form.trustedFriendName = formData.input[0];
      self.form.trustedFriendMobileNo = formData.input[1];
      self.form.pocketMoney = formData.select[0];
      self.form.spendMoney = formData.select[1];
         DataService.submit(self.form, $scope.files).then(function(resp){
          console.log(resp);
          self.response = resp;
             if(self.response.status===200){
                bootbox.alert('Data Submitted Succeesfully!')
          } else{
        bootbox.alert('Error in submitting data.')
       }
    })
  }

 }  
 ]);
}());








