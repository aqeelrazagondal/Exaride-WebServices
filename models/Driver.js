var mongoose = require('mongoose');
var User = require('./User');

// Define our schema
var DriverSchema   = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    
} , {timestamps: true});
// Export the Mongoose model
module.exports = mongoose.model('Driver', DriverSchema);