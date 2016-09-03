var app = angular.module("checkrideApp", 
                         ['ngRoute',
                          'ui.calendar',
                          'firebase',
                          'examinerDirectives',
                          'examinerCalendar',
                          'loginMod',
                          "createAccountPage",
                          'messages', 
                          'profile', 
                          'examinerControllers', 
                          'studentMod',
                          'studentDirectives']);

// logic for showing recurring event options, put in directive
//           showRecurringEventOptions: function(){
//                      $("#dowCheckBox").on("click", function(){
//                         $("#recur").toggleClass("hide"); 
//                      });
//                        $("#freq").on("change", function(){
//                             if($("#freq").val()== "weekly"){
//                                $("#dow").removeClass("hide");
//                             }else{
//                                 $("#dow").addClass('hide');
//                             }
//                        });
//                    },


/*
//MERGED
app.config(function($routeProvider){
    $routeProvider
    .when("/",{
        templateUrl:"app/shared/views/user/login/loginPage.html",
        controller:"LoginController",
        controllerAs:"login"
    })
    .when("/createAccount", {
        templateUrl: 'app/shared/views/user/createAccount/createAccountPage.html',
        controller:'createAccountController'
    })
    .when("/examiner/calendar",{
        templateUrl:"app/shared/views/examinerFiles/examinerCalendar/examinerCalendar.html",
        controller:"examinerCalendar"
    })
    .when("/examiner/profile", {
        templateUrl:'app/shared/views/examinerFiles/profile/profile.html',
        controller:'profileController'
    })
    .when("/examiner/messages",{
        templateUrl:'app/shared/views/examinerFiles/examinerMessages.html',
        controller:'messagesController'
    })
     .when("/student",{
        templateUrl:'app/shared/views/StudentFiles/examinerList/examinerList.html',
        controller:"examinerListController"
    })
    .when("/student/examinerProfile",{
        templateUrl: "app/shared/views/studentFiles/viewProfileFiles/examinerInfo/examinerInfo.html",
        controller: "examinerInfoController"
    })
    .when("/student/messages",{
        templateUrl:"app/shared/views/StudentFiles/studentMessages.html"
    })
});
*/

