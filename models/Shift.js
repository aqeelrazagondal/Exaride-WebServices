var mongoose = require('mongoose');
var User = require('./User');

var ShiftSchema = new mongoose.Schema({

    _driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    _routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Routes' },
    shiftTitle: String,
    startingTime: Date,
    endingTime: Date,
    vehicle: String,
    shiftStatus: String

}, { timestamps: true });

module.exports = mongoose.model('Shift', ShiftSchema);