// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var EmployeeSchema   = new Schema({
	  id : Number,
	  Name : String,
	  managerId : Number,
	  managerName : String,
	  reports :Number,
	  title: String,
	  Phone : String,
	  email : String,  
	  pic: String
});

module.exports = mongoose.model('Employee', EmployeeSchema);
