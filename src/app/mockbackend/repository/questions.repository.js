

/*Author: Shekhar Ramola*/
(function () {
  "use strict";
angular.module('app').factory('QuestionsRepository', function(Repository) {
    var extended = angular.extend(this, Repository)
    extended.data = 

  
[

{
  "selectQuestions":
  [
    {
    "id": 1,
    "name": "How do you manage your money?",
    "sub": 
    [ 
      {
      "id": 11, 
      "name": "How much is your monthly pocket money?",
      "ans":
      [
     ">3000","<3000",">4000","<4000",">5000","<5000"
      ]
      },
       {
      "id": 12, 
      "name": "How much do you spend?",
      "ans":
      [
     ">2000","<2000",">3000","<3000",">4000","<4000"
        
      ]
      }
      ]
  
     }
     ],
      "inputQuestions":
  [
     {
    "id": 2,
    "name": "Whom do you trust?",
    "sub": 
    [ 
      {
      "id": 21, 
      "name": "Enter a classmate name who can vouch for you"
      },
       {
      "id": 22, 
      "name": "Enter the above classmate's phone number"
      }
      ]
  
     }
     ],
     "uploadQuestions":
  [
     {
    "id": 3,
    "name": "Upload documents",
    "sub": 
    [ 
      {
      "id": 31, 
      "name": "Upload your PAN/Aadhar Card"
      },
       {
      "id": 32, 
      "name": "Upload your Permanent Address Proof "
      },
       {
      "id": 33, 
      "name": "Upload your College ID Card/Offer letter "
      }
      ]
  
     }
     ]
      
     
}
];
  
return extended;
});
}());