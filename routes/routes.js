const _ = require('lodash');
var regCtrl= require('../controller/RegistrationController.js');
var bodyParser = require('body-parser');
var User = require('../models/User.js');
var db = require('../config/db');
var logger = require('../config/lib/logger.js');
var cors = require('cors');
var mongoose = require('mongoose');
var path = require('path');
var multer = require('multer');
var FormData = require('form-data');
var http = require('http');
var request=require("request");
var fs = require('fs');



module.exports = function(app) {	
	 
	 
	 //Enable All CORS Requests
	app.use(cors());
	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Headers", "*");
		next();
	  });
    app.use(bodyParser.urlencoded({
        extended: true
    }));
	// parse application/json
	app.use(bodyParser.json())

	
	//private route
	var authenticate = (req, res, next) => {

		logger.info("in routes - authenticate ");
		var token = req.header('x-auth');
		//logger.info("Token: "+ token);
		if (token===undefined){
			res.jsonp({ status:"Failure",
			message:"Auth Token Required",
			object:[]});
		}
		else{
			logger.info("Token Received : "+token);
			User.findByToken(token).then((user) => {
				if (!user) {
					logger.info("User Not Found with token :  "+ token);
					return Promise.reject();
				}
			
				req.user = user;
				req.token = token;
				next();
				}).catch((e) => {
				logger.info("Exception Occured in Authenticate: "+e);
				res.status(401).send(res.jsonp({ status:"Failure",
									message:"Unable To Authenticate",
									object:[]}));
				});
		}	
	};
	
	
	app.get('/', function(req, res) {
		res.end("Exaride-WebServices"); 
	});

	app.post('/register',function(req,res){                         
		
		if(req.body === undefined||req.body === null) {
		 res.end("Empty Body");  
		 }
			 
		 logger.verbose('register-POST called '); 
		 var reqData=req.body;
		 logger.info("in routes /register - Req Data : "+ reqData);
		 regCtrl.register(reqData,res);	
	 
	 });


	
	app.post('/login', (req, res) => {
		if(req.body === undefined||req.body === null) {
			res.end("Empty Body");  
			}
				
			logger.verbose('login-POST called ');	
			var reqData=req.body;
			//console.log("reqData : "+ reqData.phoneNo);
			// let phoneNo = req.query.phoneNo;;
			logger.info("in routes /login - Req Data : "+ reqData);   
			regCtrl.login(reqData,res);
		
	});


}