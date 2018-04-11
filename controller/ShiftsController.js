const _ = require('lodash');
//var AppController= require('../controller/AppController.js');
var User = require('../models/User.js');
var Driver = require('../models/Driver.js');
var Rider = require('../models/Rider.js');
var Location = require('../models/Location');
var Routes = require('../models/Routes');
var Shift = require('../models/Shift');
var Location = require('../models/Location');

var db = require('../config/db');
var logger = require('../config/lib/logger.js');
//require('datejs');
var mongoose = require('mongoose');
//mongoose.Promise = global.Promise;
var multer = require('multer')
var upload = multer({ dest: './public/images/profileImages' });
//package for making HTTP Request
var request = require("request");
var http = require("http");
// We need this to build our post string
var querystring = require('querystring');

exports.addLocation = function (reqData, res) {

    try {
        logger.info('ShiftController. called  :');
        var title = reqData.title;
        var loc = reqData.loc;
        var newLocation;
        var locaResponseObject;

        if (title !== undefined && loc !== undefined){
            newLocation = new Location({
                title: title,
                loc: loc
            });

            newLocation.save().then((location) => {
                console.log("Title " + title);
                console.log("Location : " + loc);
                locaResponseObject = {
                    "title": location.title,
                    "location": location.loc
                };

                res.status(201).jsonp({
                    status: 'success',
                    message: 'Added Location Succesfully',
                    object: locaResponseObject
                });
            });



        }else {}
       

    } catch (err) {
        logger.info('An Exception Has occured in ShiftController.addRoue method' + err);
        res.jsonp({
            status: "Failure",
            message: "Some Error Occured While Registering New User",
            object: []
        });
    }   
}

exports.addRoute = function (reqData, res) {

    try {
        logger.info('ShiftController. called  :');
        var routeManager = reqData.routeManager;
        var beginLocationId = reqData._beginLocationId;
        var endLocationId = reqData._endLocationId;
        var newRoute;
        var routeResponseObject;

        if (routeManager !== undefined && beginLocationId !== undefined && endLocationId !== undefined) {
            console.log("routeManager " + routeManager);
            console.log("beginLocationId : " + beginLocationId);
            console.log("endLocationId : " + endLocationId);
            newRoute = new Routes({
                routeManager: routeManager,
                _beginLocationId: beginLocationId,
                _endLocationId: endLocationId
            });

            newRoute.save().then((result) => {

             
                
                routeResponseObject = {
                    "routeManager": result.routeManager,
                    "beginLocationId": result._beginLocationId,
                    "endLocationId": result._endLocationId
                };

                res.status(201).jsonp({
                    status: 'Successful',
                    message: 'Routes added Succesfully',
                    object: routeResponseObject
                });
            })
            .catch((e) => {
                logger.info('Error in saving Route: ', e);
                res.jsonp({
                    status: "Failure",
                    message: "Some Error Occured While saving New Route",
                    object: []
                }); 
            });

        } else { 
            res.send("Body is empty! ");
        }


    } catch (err) {
        logger.info('An Exception Has occured in ShiftController.addLocation method' + err);
        res.jsonp({
            status: "Failure",
            message: "Some Error Occured While Registering New User",
            object: []
        });
    }
}

exports.addShift  = function(reqData, res){
    try{
        var driverId = reqData._driverId;
        var routeId = reqData._routeId;
        var shiftTitle = reqData.shiftTitle;
        var startingTime = reqData.startingTime;
        var endingTime = reqData.endingTime;
        var vehicle = reqData.vehicle;
        var shiftStatus = reqData.shiftStatus;

        var newShift;
        var shiftResponseObject;

        if (driverId !== undefined && routeId !== undefined && shiftTitle !== undefined && startingTime !== undefined && endingTime !== undefined && vehicle !== undefined && shiftStatus !== undefined){
            console.log("DriverId " + driverId);
            console.log("routeId " + routeId);
            newShift = new Shift({
                _driverId: driverId,
                _routeId: routeId,
                shiftTitle: shiftTitle,
                startingTime: startingTime,
                endingTime: endingTime,
                vehicle: vehicle,
                shiftStatus: shiftStatus
            });           

            newShift.save().then((result) => {
                shiftResponseObject = {
                    "driverId": result._driverId,
                    "routeId": result._routeId,
                    "shiftTitle": result.shiftTitle,
                    "startingTime": result.startingTime,
                    "endingTime": result.endingTime,
                    "vehicle": result.vehicle,
                    "shiftStatus": result.shiftStatus
                };

                res.status(201).jsonp({
                    status: 'Successful',
                    message: 'Routes added Succesfully',
                    object: shiftResponseObject
                });
            })
            .catch((e) => {
                logger.info('Error in saving Shift: ', e);
                res.jsonp({
                    status: "Failure",
                    message: "Some Error Occured While saving New Shift",
                    object: []
                });
            });


        }else {
            res.send("Body is empty! ");
        }

    }catch(e){
        logger.info('An Exception Has occured in ShiftController.addShift method' + e);
        res.jsonp({
            status: "Failure",
            message: "Some Error Occured While Registering New Shift",
            object: []
        });
    }
}

exports.findAllShift = function (req, res) {
    var saveUser;
    var shiftResponseObject;

    try {
        

        Shift.find({}, function (err, shifts) {
            console.log("shifts " + shifts);

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
                    message: "List Of shifts",
                    // userName: shifts.userName,
                    object: shifts
                });
            }
        });

       
    } catch (err) {
        logger.info('An Exception Has occured in getUserLocation method' + err);
    }
}

exports.getShiftByDriverId = function (driverId, res){
    Shift.find({ _driverId: driverId}, (err, shift) => {
        User.find({_id: driverId}, (err, user) => {
          console.log(user);
        //   var username = user.
        })

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
                message: "List Of shifts by driver id",
                // userName: shifts.userName,
                object: shift
            });
        }
    });        
}

exports.getListOfLocations = function (req, res) {
    var saveLocations;
    var locationResponseObject;

    try {
        Location.find({}, function (err, locations) {
            console.log("LOcations " + locations);

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
                    message: "List Of locations",
                    // userName: shifts.userName,
                    object: locations
                });
            }
        });
    } catch (err) {
        logger.info('An Exception Has occured in getUserLocation method' + err);
    }
}

exports.getRoutesByRouteId = function (id, res) {

    Routes.find({ _id: id }, (err, route) => {

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
                message: "List Of Routes by route id",
                object: route
            });
        }
    })
}
