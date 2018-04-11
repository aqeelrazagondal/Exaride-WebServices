const _ = require('lodash');
var regCtrl= require('../controller/RegistrationController.js');
var shiftCtrl = require('../controller/ShiftsController');
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
var User = require('../models/User');



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
					return Promise.reject("");
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
		res.send("Exaride-WebServices"); 
	});

	app.post('/register',function(req,res){                         
		
		if(req.body === undefined||req.body === null) {
		 	res.send("Empty Body");  
		 }
			 
		 logger.verbose('register-POST called '); 
		 var reqData=req.body;
		 logger.info("in routes /register - Req Data : "+ reqData);
		 regCtrl.register(reqData,res);	
	 
	 });


	
	app.post('/login', (req, res) => {
		if(req.body === undefined||req.body === null) {
				res.send("Empty Body");  
			}
				
			logger.verbose('login-POST called ');	
			var reqData=req.body;
			//console.log("reqData : "+ reqData.phoneNo);
			// let phoneNo = req.query.phoneNo;;
			logger.info("in routes /login - Req Data : "+ reqData);   
			regCtrl.login(reqData,res);
		
	});

	// Add location 
	app.post('/addLocation', (req, res) => {
		if (req.body === undefined || req.body === null) {
			res.send("Empty body: ");
		}

		logger.verbose('addLocation-POST Route called');
		var reqData = req.body;
		logger.info("in Routes /addLocation - Req Data : " + reqData);
		shiftCtrl.addLocation(reqData, res);

	});

	// get locations
	app.get('/getLocationsList', (req, res) => {
		console.log("In routes get shify by userId")
		shiftCtrl.getListOfLocations(req, res);
	});

	// Add route by starting point and ending point
	app.post('/addRoute', (req, res) => {
		if (req.body === undefined || req.body === null) {
			res.send("Empty body: ");
		}

		logger.verbose('addRoute-POST Route called');
		var reqData = req.body;
		logger.info("in Routes /addRoute - Req Data : " + reqData);

		shiftCtrl.addRoute(reqData, res);
	});

	app.get('/getRoute/:id', (req, res) => {
		var id = req.params.id;
		console.log("In routes get Route by routeId")
		shiftCtrl.getRoutesByRouteId(id, res);
	});

	app.post('/addShift', (req, res) => {
		if (req.body === undefined || req.body === null) {
			res.send("Empty body: ");
		}

		logger.verbose('addShift-POST Route called');
		var reqData = req.body;
		logger.info("in Routes /addShift - Req Data : " + reqData);

		shiftCtrl.addShift(reqData, res);
	});

	app.get('/getShifts', function (req, res) {
		console.log("in routes get shifts");
		shiftCtrl.findAllShift(req, res);
	});

	app.get('/shifts/:driverId', (req, res) => {
		var driverId = req.params.driverId;
		console.log("In routes get shify by userId")
		shiftCtrl.getShiftByDriverId(driverId, res);
	});

	app.patch('/shifts/:userId', (req, res) => {
		var id = req.params.userId;
		const updateOps = {};
		for (const ops of req.body) {
			updateOps[ops.propName] = ops.value;
		}

		User.update({ _id: id }, { $set: updateOps }, (err, user) => {
			if (err) {
				res.status(400).send({
					status: "failure",
					message: err,
					object: []
				});
			}
			else {
				res.jsonp({
					status: "success",
					message: "Update User by driver id",
					// userName: shifts.userName,
					object: user
				});
			}
		})
	});
}