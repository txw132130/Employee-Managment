var module = angular.module('myApp',['ngRoute','customServices','infinite-scroll','ngFileUpload']);

module.config(['$routeProvider',function($routeProvider){
	$routeProvider
	.when('/',{
		 redirectTo: '/list'
	})
	.when('/list',{
		templateUrl:'list.html',
		controller:'EmployeeCtrl'
	})
	.when('/createNew',{
		templateUrl:'newEmployee.html',
		controller:'newEmployeeCtrl'
	})
	.when('/edit',{
		templateUrl:'edit.html',
		controller:'editCtrl'
	})
	.when('/list/:employeeId/reports',{
		templateUrl:'reportslist.html',
		controller:'reportslistCtrl'
	})
	.when('/list/:employeeId',{
		templateUrl:'manager.html',
		controller:'managerCtrl'
	});
}]);



module.controller('EmployeeCtrl',['$scope','myService','$location','$rootScope', function($scope,myService,$location,$rootScope) {
	$rootScope.go = function(path){
	    $scope.slide = 'slide-left';
	    $location.url(path);
	  };
	
	$scope.Name = '';
	$scope.fName = '';
	$scope.lName = '';
	$scope.passw1 = '';
	$scope.passw2 = '';
	$scope.Employees = [];
    myService.getdata($scope);

	$scope.edit = true;
	$scope.error = false;
	$scope.incomplete = false; 
	$scope.$watch('passw1',function() {$scope.test();});
	$scope.$watch('passw2',function() {$scope.test();});
	$scope.$watch('fName', function() {$scope.test();});
	$scope.$watch('lName', function() {$scope.test();});
	$scope.$watch('Sex', function() {$scope.test();});
	
	$scope.test = function() {
	  if ($scope.passw1 !== $scope.passw2) {
	    $scope.error = true;
	    } else {
	    $scope.error = false;
	  }
	  $scope.incomplete = false;
	  if ($scope.edit && (!$scope.fName.length ||
	  !$scope.lName.length ||
	  !$scope.passw1.length || !$scope.passw2.length)) {
	     $scope.incomplete = true;
	  }
	};
	
    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   
        $scope.reverse = !$scope.reverse; 
    };
      
    $scope.remove = function(Id){	
       myService.deleteEmployee(Id,$scope);
	};	
  	
    $scope.setPage = function(num){ 
    	$scope.currentPage = num; 
    	};
    	
	 $scope.save= function(id){
	        myService.setid(id);         
     };
     
     
  
}]);


module.controller('editCtrl',['$scope','myService', '$location','Upload',function($scope,myService,$location,Upload) {
	  $scope.goBack =function() {   		
	 	    window.history.back();
	 	}
	function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                $('#blah').attr('src', e.target.result);
            }
            
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    $("#imgInp").change(function(){
        readURL(this);
    });
	myService.geteditEmployee($scope); 
    $scope.upload = function(){    	
    	myService.reload($scope,$scope.uploadfile,Upload);
    	
    }
    $scope.editEmployee = function(){  
    	
    	if($scope.Name == undefined|| $scope.email == undefined || $scope.title == undefined ||$scope.Phone == undefined){
	    	  alert('Please fill all information') 
	      }
	      else{
	    	  myService.editEmployee($scope,$location,$scope.uploadfile);
	      }
    }
}]);

module.controller('newEmployeeCtrl',['$scope','myService','$location','Upload', function($scope,myService,$location,Upload){  
	  $scope.goBack =function() {   		
	 	    window.history.back();
	 	}
	
	function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                $('#blah').attr('src', e.target.result);
            }
            
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    $("#imgInp").change(function(){
        readURL(this);
    });
	
	  myService.getmanager($scope);
	  $scope.upload = function(){ 
	    	myService.load($scope,$scope.uploadfile,Upload);
	   }

      $scope.add = function(){ 
	      if($scope.Name == undefined||$scope.uploadfile == undefined|| $scope.email == undefined || $scope.title == undefined ||$scope.Phone == undefined){
	    	  alert('Please fill all information') 
	      }
	      else{
		      $scope.reports =0;
		      $scope.imagename = $scope.newid+'_'+$scope.uploadfile.name;	
		      if($scope.managerName== undefined||$scope.managerName.id == 'no Manager'){
		    	  $scope.newmanagerid = 0      
		          $scope.newmangerName = ''; 
		      }else{
		    	  $scope.newmanagerid = $scope.managerName.id;      
		          $scope.newmangerName = $scope.managerName.Name;  
		      }  
		      $scope.Employee = ({ 	"id": $scope.newid,"Name": $scope.Name,"managerName": $scope.newmangerName,"managerId":$scope.newmanagerid, 	                  
		    	  					"reports" : $scope.reports,"title": $scope.title,"Phone": $scope.Phone,
		    	  				   "email": $scope.email,"pic": $scope.imagename});
		      myService.newEmployee($scope,$scope.Employee,$location);
	      }
      }

}]);


module.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                });
            });
        }
    }
}]);

module.controller('reportslistCtrl', ['$scope','myService',function ($scope,myService,$location) {
	 
 	  $scope.goBack =function() {   		
 	    window.history.back();
 	}
    $scope.managerid = myService.getid();
    myService.getdata($scope);
}]);



module.controller('managerCtrl', ['$scope','myService',function ($scope,myService,$location) {
	  $scope.goBack =function() {   		
	 	    window.history.back();
	 	}
    $scope.employeeid = myService.getid();
    myService.getmanagerlist($scope);
}]);

