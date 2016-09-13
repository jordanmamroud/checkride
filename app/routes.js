angular.module('crRoutes',['ngRoute'])
.config(['$routeProvider', '$locationProvider', '$logProvider', 'RoutePaths', function($routeProvider, $locationProvider, $logProvider, RoutePaths){
    
    
    $routeProvider
    .when('/', {
        templateUrl : 'app/components/search/search.html'
    })
    .when(RoutePaths.login.path, {
        templateUrl:'app/auth/login.html',
        controller:"crAuthCtrl",
        controllerAs:"auth"
    })
    .when(RoutePaths.signUp.path, {
            templateUrl: 'app/auth/create-user.html',
            controller:'crAuthCtrl',
            controllerAs:"auth"
    })
    .when(RoutePaths.examinerCal.path, {
             templateUrl:"app/users/views/examinerCalendar.html",
             controller:"examinerCalendarController",
             controllerAs:"vm"       
    })
    .when(RoutePaths.profile.path, {
            templateUrl: 'app/users/views/profile.html',
            controller:"profileController"
    })
    .when(RoutePaths.examinerMessages.path,{
         templateUrl:'app/users/views/examinerMessages.html',
         resolve:{
             conversations:function(commonServices){
                    var userInfo = commonServices.getCookieObj('currentUser');
                    var userId = userInfo.emailAddress.replace(/[\*\^\.\'\!\@\$]/g, '');
                    var userRef = commonServices.getCommonRefs().usersRef.child(userId);
                    var conversationsRef = userRef.child("conversations").orderByChild('lastReceivedMsg');
                    
                    return commonServices.createFireArray(conversationsRef).$loaded();
             }
         }
    })
    
    //studentPaths
    .when(RoutePaths.examinerList.path,{
        templateUrl:'app/users/views/examinerList.html',
        controller:"examinerListController"
    })

    .when(RoutePaths.examinerInfo.path,{
            templateUrl: "app/users/views/examinerInfo.html",
            controller: "examinerInfoController",
            controllerAs:'vm'
    })

    .when(RoutePaths.viewExaminerAvailability.path,{
        templateUrl: "app/users/views/examinerAvailability.html",
        controller: "examinerAvailabilityController"
    })
    .when(RoutePaths.studentMessages.path,{
        templateUrl:"app/users/views/studentMessages.html"
    })
  

    .otherwise({
        redirectTo:'/'
        
    })
    //End Author
}])



//Move later
.constant('RoutePaths', {
    login: {
        name: 'Log in',
        path: '/log-in',
        eula: '/login/eula',
        noSubscription: '/no-subscription',
        myAccount: '/my-account',
        createAccount: '/my-account/create',
        createAccountFromXID: '/my-account/update',
        // more routes here
    },
    signUp: {
        name: 'Sign-Up',
        path: '/create-account'
        // more routes here
    },
    examinerCal:{  
        path:'/user/calendar'
    },
    examinerMessages:{
        path:"/user/messages"
    },
    profile:{
        path:"/user/profile"
    },
    //student paths
    
    examinerInfo:{
        path:"/user/examiner-info"
    },
    examinerList:{
        path:'/user/list-of-examiners'
    },
    viewExaminerProfile:{
        path:"/user/view-profile-info"
    },
    viewExaminerAvailability:{
        path:"/user/view-availability"
    },
    studentMessages:{
        path:"/user/student-messages"
    }
})