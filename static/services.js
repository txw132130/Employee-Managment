angular.module("customServices", [])
    .factory('myService', function ($http) {
      var service = {};
       	  service.Employeeid = 1;
      
       	  
       	  
    	  service.getdata = function($scope){ 
           $http.get('/api/list')
             .success(function(res){
     
             $scope.Employees = res;
             $scope.data = $scope.Employees.slice(0, 8);    
             $scope.getMoreData = function () {
        	 if($scope.data.length < $scope.Employees.length) 
    		 $scope.data = $scope.Employees.slice(0, $scope.data.length + 2);	              
             }
       	  	}).error(function(){
           		console.log('error here')
        	})    	
    	  }; 
    	  service.getmanagerlist = function($scope){ 
              $http.get('/api/list/'+service.Employeeid)
                .success(function(res){ 	
	                $scope.Employee = res;
	          	  	}).error(function(){
	              		console.log('error here')
	          	  	})
       	  }; 
       	  
    	  service.getmanager = function($scope){ 
              $http.get('/api/list')
                .success(function(res){
                $scope.Employees = res;
                $scope.newid = res[res.length-1].id+1;
                $scope.Employees.push({'id':'no Manager'})
                
              
           	})
           	
       	  }; 
	      service.setid = function(id){
	        	service.Employeeid = id;
	        };
	      service.getid = function(){
	        	return service.Employeeid;
        	
	        };
          service.geteditEmployee = function($scope){
	        	 $http.get('/api/list')
		             .success(function(res){
		             $scope.Employees = res;
		             $scope.Managers = []; 
		             var childId =[];
		             var index = [];
		             childId.push(service.Employeeid);
		             index.push(service.Employeeid);
		             $scope.getmangaer =function(){
		            	var child = [];
			             for(i=0;i<res.length;i++){  
			            	    for(j=0;j<childId.length;j++){
			            	    	if($scope.Employees[i].managerId == childId[j] && $scope.Employees[i].reports !=0){
				            	     child.push($scope.Employees[i].id);
				            	     break;
			            	    	}	    	
			            	    }; 
		                     
			             }
			            if(child.length>0){
			            	 childId = [];
		                   	 for(i=0;i<child.length;i++){	             
		                   		 childId.push(child[i]);
		                   		 index.push(child[i]);
		                   	 }
		                   	 $scope.getmangaer();
	                    }
		  	        	
		             };
		            $scope.getmangaer();		            
		            var state;
		            for(i=0;i<res.length;i++){
		            	if($scope.Employees[i].id == service.Employeeid)
		            	continue;
		            	state = true;		            	
		            	for(j=0;j<index.length;j++){
	            	    	if($scope.Employees[i].managerId == index[j]){
	                            state = false;
	                            break;
	            	    	}
	            	    }; 
	            	    if(state)
	            	    $scope.Managers.push($scope.Employees[i]);	
		            }

		             
        
		             $scope.Managers.push({'id':'no Manager'});           
		        	 $http.get('/api/list/'+service.Employeeid)
		            	 .success(function(res){
		             		var id = service.editid;          		
		             		$scope.oldmanagerid = res.managerId
		             		$scope.pic = res.pic;
		             		$scope.Name = res.Name;
		             		$scope.title = res.title;
		             		$scope.Phone = res.Phone; 
		             		$scope.email = res.email;
		             		$scope.managerName = res.managerName
		             		$scope.managerId = res.managerId;
		             		$scope.id = res.id;
		             		$scope.storeManager = res;
		  					$scope.Employee = res;

		            	 	}).error(function(){
		           			console.log('error here')
		        			});
	       	  		}).error(function(){
	       	  				console.log('error here')
	       	  	});
	        	
	        }
	         service.editEmployee = function($scope,$location,file) {
	        	 
	         		var Employee = {};
	         		Employee.Name = $scope.Name;
	         		Employee.title = $scope.title;
	         		Employee.Phone = $scope.Phone;
	         		Employee.email = $scope.email;
	         		if(file){
	         			$scope.imagename = $scope.id+'_'+file.name;		
	             		Employee.pic = $scope.imagename;
	         		}else{
	         			Employee.pic = $scope.pic;
	         		}
	                
	         		Employee.oldmanagerid = $scope.oldmanagerid;
	         		if($scope.Manager_Name == undefined){
	         			Employee.managerId = $scope.storeManager.managerId;
	         			Employee.managerName = $scope.storeManager.managerName;
	         		}else{
	         			if($scope.Manager_Name.id =='no Manager'){
		         			Employee.managerId = 0;
		         			Employee.managerName ='';
		         		}else{	
		         			Employee.managerId = $scope.Manager_Name.id ;
		             		Employee.managerName = $scope.Manager_Name.Name;
		         		}
	         		}
	         			
	         		
					$http.put('/api/list/'+service.Employeeid,Employee)
	             		.success(function(res,req){
	           			 $location.path('/list');
	         			}).error(function(){
	       				console.log('error here')
	         		});
	             	
				};
	        
	        service.deleteEmployee = function(id,$scope){
	        	$http.delete('/api/list/'+id)
	           	 .success(function(res){ 
	           	    $scope.Employees = res; 
	           	    $scope.data = $scope.Employees; 
	           	 }).error(function(){
	       				console.log('error here')
	         	 });
			 
		    };
		     service.newEmployee = function($scope,Employee,$location){
		       $http.post('/api/list',Employee)
	             .success(function(res){         	
	              $location.path('/list');
	             }).error(function(){
       				console.log('error here')
	         	 });
		     
		     }
		     service.load = function($scope,file,Upload){	    	 
		    	 Upload.upload({
	                 url: '/api/upload',  
	                 file: file
	             }).success(function(res){
	 	    		console.log('post success')
	 	    	}).error(function(){
	 	       		console.log('error here')
	 	    	})         
		     };
		     service.reload = function($scope,file,Upload){
		    	 Upload.upload({
	                 url: '/api/reload',  
	                 file: file,        
	                 data: {ID: service.Employeeid}
	             }).success(function(res){
	 	    		console.log('post success')
	 	    	}).error(function(){
	 	       		console.log('error here')
	 	    	})  
		     };
   return service;
});

	
    
    