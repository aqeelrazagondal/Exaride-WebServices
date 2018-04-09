const _ = require('lodash');
//var AppController= require('../controller/AppController.js');
var User = require('../models/User.js');
var Driver = require('../models/Driver.js');
var Rider = require('../models/Rider.js');
var db = require('../config/db');
var logger = require('../config/lib/logger.js');
//require('datejs');
var mongoose = require('mongoose');
//mongoose.Promise = global.Promise;
var multer  = require('multer')
var upload = multer({ dest: './public/images/profileImages' });
//package for making HTTP Request
var request=require("request");
var http = require("http");
// We need this to build our post string
var querystring = require('querystring');
//package to generate a random number
var randomize = require('randomatic');
//mongoose.createConnection(db.url);

//mongoose.connect(db.url);

//Get the default connection
//var dbCon = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
//dbCon.on('error', console.error.bind(console, 'MongoDB connection error:'));


var userExists=function(email,callback){
    
    logger.info('UserExists Method Called');
     var query = { email : email };
     User.findOne(query).exec(function(err, user){
        if (err){
            logger.error('Some Error while finding user' + err );
            res.status(400).send({status:"failure",
                                  message:err,
                                  object:[]
            });
        }
        else{
            if (user){
                
                logger.info('User Found with Email :'+email);                
                //console.log("user found with Email "+email);
                callback (user);
            }
            else{
                
                logger.info('User Not Found with Email :'+email);
               // console.log("user not found with Email "+email);
                callback( user);
                
            }
       }
     } );
    
    logger.info(' Exit UserExists Method');	
}



exports.register=function(reqData,res){
    
    try{
    // var body = _.pick(req.body, ['email', 'password']);
    // var user = new User(body);    
    logger.info('RegistrationController.register called  :'+ reqData.email );
    
    var email = reqData.email;
    var password = reqData.password;
    var userType = reqData.userType;
    var os = reqData.os;
    var newuser;
    var newSubUser;
    var newDriver;
    var newRider;
    var userResponseObject;

    if (userType!==undefined&&password!==undefined&&email!==undefined){
        userType=userType.toLowerCase();
        userExists(email,function(userExist){
            logger.info('User Exists Response : ' + userExist );
            if (userExist===null){
                logger.info("Creation New User");
                        
                    newuser = new User({  
                    email: email,
                    password:password,
                    user_type:userType,
                    OS:os,
                    verified_user:true                          
                });
                    

                newuser.save().then((user) => {
                
                    console.log("User : "+ user);
                    userResponseObject={
                        "_id":user._id,
                        "email":user.email,
                        "userType":user.user_type,
                        
                    };
                 
                    if (userType==="driver"){

                        newDriver=new Driver({
                            _userId:user._id
                        });
                        newDriver.save(function (err, driver) {
                            if (err){
                                logger.info ('Error While Creating New Driver ');
                            }
                        });

                    }
                    else if (userType==="rider"){
                        newRider=new Rider({
                            _userId:user._id
                        });
                        newRider.save(function (err, rider) {
                            if (err){
                                logger.info ('Error While Creating New Rider ');
                            }
                        });
                    }
                    return user.generateAuthToken();
                    })
                    .then((token) => {                   
                        res.setHeader('x-auth', token);
                        res.jsonp({status:"Success",
                        message:"Successfully Registered",
                        object:userResponseObject}); 
                    })
                    .catch((e) => {
                        //res.status(400).send(e);
                        logger.info('Error in saving User: ', e);
                        res.jsonp({status:"Failure",
                        message:"Some Error Occured While Registering New User",
                        object:[]
                    }); 
                    })

        }
        else{
            res.jsonp({status:"Failure",
            message:"User with this Email Already Exists",
            object:[]});
        }
    });
    }
    else {
        res.jsonp({status:"Failure",
        message:"Please Enter All Required Fields for Registration",
        object:[]});
    }
   
 
         
    logger.info(' End RegistrationController.register Method');
    }catch (err){
		logger.info('An Exception Has occured in RegistrationController.register method' + err);
	}
}
            


exports.login=function(reqData,res){
    var userResponseObject;
    
    try{
        var email = reqData.email;
        var password = reqData.password;
        logger.info('RegistrationController.login called  :'+ email  );
   
//     //Check If User Exists
        userExists(email,function(userExist){
            logger.info('User Exists Response : ' + userExist );
            if (userExist===null){
                res.jsonp({status:"Failure",
                    message:"No User Exist with Email : "+email,
                    object:[]}); 
            }else{

                User.findByCredentails(email, password)
                .then((user) => {
                
                userResponseObject={
                    "_id":user._id,
                    "email":user.email,
                    "userType":user.user_type,
                    
                };
                return user.generateAuthToken().then((token) => {
                        //res.header('x-auth', token).send(user);
                        res.setHeader('x-auth', token);
                        res.jsonp({
                            status:"Success",
                            message:"Successfully Logged In",
                            object:userResponseObject
                        }); 
                        
                });
                
                })
        .catch((e) => {
            //res.status(400).send();
            logger.info("Exception Occured while Login"+e);
            res.jsonp({status:"Failure",
                message:"Unable To Login",
                object:[]});
            })
        }
    });
         
    logger.info(' End RegistrationController.login Method');
    }catch (err){
		logger.info('An Exception Has occured in RegistrationController.login method' + err);
	}
}



            /**********  Above Code is Working*****/
    

