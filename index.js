var express    = require('express');                        
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var path    = require('path');
var fs = require('fs');
var path = require('path');
var fs = require('fs-extra');



var Employees  = require('./models/Employees');

var multipartMiddleware = multipart();

var mongoose   = require('mongoose');
mongoose.connect('mongodb://user:user@jello.modulusmongo.net:27017/Ur3itete');

var app = express(); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/static')));


var filePath;			
var port = process.env.PORT || 8080;    



var router = express.Router();    


router.use(function(req, res, next) {
    console.log('Something is happening.');
    next(); 
});


router.get('/list', function(req, res) {  
	Employees.find(function(err, Employees) {
            if (err)
                res.send(err);
            res.json(Employees);
        }); 
});

router.post('/reload',multipartMiddleware,function(req,res){  
     var ID = req.body.ID
	 var picfile;
	 var oldPath = {};
	 picfile = req.files; 
	 oldPath = picfile.file.path;
     fs.copy( ''+oldPath, 'static/pics/'+picfile.file.name, function (err) {
 		  if (err) return console.error(err)
 		  
 		   fs.rename('static/pics/'+picfile.file.name, 'static/pics/' + ID + '_' + picfile.file.name, function(err) {
 			   if ( err ) console.log('ERROR: ' + err);
 		   });
 		  console.log("success!")
 		});
});

router.post('/upload',multipartMiddleware,function(req,res){
    var newid;
	 var picfile;
	 var oldPath = {};
	 picfile = req.files;
	 oldPath = picfile.file.path;
	Employees.find(function(err, Employees) {
       if (err)
           res.send(err);
       newid = Employees[Employees.length-1]+1;
       fs.copy( ''+oldPath, 'static/pics/'+picfile.file.name, function (err) {
 		  if (err) return console.error(err)
 		  console.log(newid)
 		   fs.rename('static/pics/'+picfile.file.name, 'static/pics/' + newid + '_' + picfile.file.name, function(err) {
 			   if ( err ) console.log('ERROR: ' + err);
 		   });
 		  console.log("success!")
 		});
   }); 
	
});

router.route('/list')

    .post(function(req, res) {
        
        var Employee = new Employees();      
        var query = {id :req.body.managerId};
        if(req.body.managerId!=0){
        Employees.findOne(query, function(err, Employee) {
            if (err) {
                res.send(err);
              }  
            Employee.reports ++; 
            Employee.save(function(err) {
                if (err)
                    res.send(err);      
            });

        });
        }
        Employee.id = req.body.id;
        Employee.pic = req.body.pic;   
        Employee.Name = req.body.Name; 
        Employee.title = req.body.title;
        Employee.reports = req.body.reports;
        Employee.Phone = req.body.Phone;
        Employee.email = req.body.email;
        
        Employee.managerId = req.body.managerId;
        Employee.managerName = req.body.managerName;
       
        Employee.save(function(err) {
            if (err)
                res.send(err);      
            res.json({ message: 'Employee created!' });
        });
        
    })

router.route('/list/:id')
    .get(function(req, res) { 
		var query = {id :req.params.id};
        Employees.findOne(query, function(err, Employee) {
            if (err) {
                res.send(err);
              }  
            console.log(Employee)
            res.json(Employee);
            
        });
    })
  .put(function(req, res) {
        var query = {id :req.params.id};
        Employees.findOne(query, function(err, Employee) {
    			if (err){
                res.send(err);
         } 
           Employee.Name = req.body.Name; 
           Employee.title = req.body.title;
           Employee.Phone = req.body.Phone;
           Employee.email = req.body.email;
           Employee.managerId = req.body.managerId;
           Employee.managerName = req.body.managerName; 
           Employee.pic = req.body.pic; 
           
          if(req.body.oldmanagerid == 0 && req.body.managerId == 0){
        	  
          }
          if (req.body.oldmanagerid != 0 && req.body.managerId ==req.body.oldmanagerid){
        		  
          }
          if(req.body.oldmanagerid == 0 && req.body.managerId !=req.body.oldmanagerid){
        	  var query2 = {id :Employee.managerId};
        	  Employees.findOne(query2, function(err, Employee) {
	               if (err) {
	                   res.send(err);
	                 }  
	               Employee.reports ++; 
	               Employee.save(function(err) {
	                   if (err)
	                       res.send(err);      
	               });
	           });         
          }
          if(req.body.oldmanagerid != 0 && req.body.managerId ==0){
        	  var query3 = {id :req.body.oldmanagerid};         
	           Employees.findOne(query3, function(err, Employee) {
	               if (err) {
	                   res.send(err);
	                 }  
	               Employee.reports --; 
	               Employee.save(function(err) {
	                   if (err)
	                       res.send(err);      
	               });
	           });       
          }
          if(req.body.oldmanagerid != 0 && req.body.managerId !=0 && req.body.oldmanagerid != req.body.managerId ){
        	  var query4 = {id :Employee.managerId}; 
        	  var query5 = {id :req.body.oldmanagerid};
	           Employees.findOne(query4, function(err, Employee) {
	               if (err) {
	                   res.send(err);
	                 }  
	               Employee.reports ++; 
	               Employee.save(function(err) {
	                   if (err)
	                       res.send(err);      
	               });
	           }); 
	           Employees.findOne(query5, function(err, Employee) {
	               if (err) {
	                   res.send(err);
	                 }  
	               Employee.reports --; 
	               Employee.save(function(err) {
	                   if (err)
	                       res.send(err);      
	               });
	           });       
          }

     
          Employee.save(function(err) {
                if (err)
                    res.send(err);
                console.log('Employee:'+Employee)
                res.json({ message: 'Employee updated!' });
            });
           

        });
    })
   .delete(function(req, res) {
	   var query = {id :req.params.id};     
       Employees.findOne(query, function(err, Employee) {
    	   var query2 = {managerId :Employee.id};
    	   var query3 = {id :Employee.managerId};
    	   
           if (err) {
               res.send(err);
             }  
         
	           if(Employee.reports == 0){
		        	   if(Employee.managerId !=0){
		    	           	Employees.findOne(query3, function(err, Employee3) {
		    	                if (err) {
		    	                    res.send(err);
		    	                  }  
		    	                Employee3.reports--;
		    	               
		    	                Employee3.save(function(err) {
		    		                   if (err)
		    		                       res.send(err);  
		    		                   fs.remove('static/pics/'+Employee.pic);
		    		            	   Employees.remove(query, function(err, Employee) {
		    		                        if (err)
		    		                            res.send(err);
		    		                        Employees.find(function(err, Employees) {
		    		                            if (err)
		    		                                res.send(err);
		    		                           
		    		                            res.json(Employees);
		    		                        }); 
		    		                    });
		    		               });
		    	           	})
		               	}else{
		               		fs.remove('static/pics/'+Employee.pic);
		            	   Employees.remove(query, function(err, Employee) {
		                       if (err)
		                           res.send(err);
		                       Employees.find(function(err, Employees) {
		                           if (err)
		                               res.send(err);
		                           
		                           res.json(Employees);
		                       }); 
		                   });
		            	   
		               }
	           }else{ 
	        	   
		        	   Employees.find(query2, function(err, Employee2) {
			                if (err) {
			                    res.send(err);
			                  }  
			                console.log(Employee2);
			                for(i=0;i<Employee2.length;i++){
			                	Employee2[i].managerId  = 0;
				                Employee2[i].managerName = '';
				                Employee2[i].save(function(err) {
					                   if (err)
					                       res.send(err);  
			
				                })
			                }
			                console.log(Employee2);
			                
			               
		        	   });
		                if(Employee.managerId !=0){
		    	           	Employees.findOne(query3, function(err, Employee3) {
		    	                if (err) {
		    	                    res.send(err);
		    	                  }  
		    	                Employee3.reports--;
		    	               
		    	                Employee3.save(function(err) {
		    		                   if (err)
		    		                       res.send(err);  
		    		                   fs.remove('static/pics/'+Employee.pic);
		    		            	   Employees.remove(query, function(err, Employee) {
		    		                        if (err)
		    		                            res.send(err);
		    		                        Employees.find(function(err, Employees) {
		    		                            if (err)
		    		                                res.send(err);
		    		                           
		    		                            res.json(Employees);
		    		                        }); 
		    		                    });
		    		               });
		    	           	})
		               	}else{
		               		fs.remove('static/pics/'+Employee.pic);
		            	   Employees.remove(query, function(err, Employee) {
		                       if (err)
		                           res.send(err);
		                       Employees.find(function(err, Employees) {
		                           if (err)
		                               res.send(err);
		                           
		                           res.json(Employees);
		                       	}); 
		                   });
		            	   
		               }
	          
	        	   };
	        	   
       });  
});

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);
