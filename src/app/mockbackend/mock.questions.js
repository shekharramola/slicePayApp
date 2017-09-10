   

/*Author: Shekhar Ramola*/

angular.module('app').run(function(BaseBackend, $httpBackend, QuestionsRepository) {
    $httpBackend.whenGET('/home').respond(function(data) {

        var questions = QuestionsRepository.getAll();
        return [200, questions, {}];
    });

    $httpBackend.whenPOST('/home').respond(function(data) {
        var questions = QuestionsRepository.create(data);
        return [200, questions, {}];
    }); 

   $httpBackend.whenGET(/templates\//).passThrough();
    return angular.extend(this, new BaseBackend(QuestionsRepository,"questions"));

});




