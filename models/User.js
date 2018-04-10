// grab the things we need
const _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
//mongoose.Promise = global.Promise;
// create a schema

//mongoose.createConnection('mongodb://localhost/aldaalah');

var UserSchema = new Schema({
  
   // username: { type: String, required: true, unique: true },
      userName: String, 
      //phone: String,
      full_name: String,
      profile_photo_url:{type:String,default:null },
      active:Boolean, 
      OS:String,
      email:{
          type: String, required: true, unique: true,trim: true,
          validate: {
          validator: validator.isEmail,
          message: '{VALUE} is not a valid email'
          }
     },
     password: {
      type: String,
      require: true,
      minlength: 6
    },
    tokens: [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }],
      verified_user:Boolean,
	    deactivate_user:{ type: Boolean, default: false },
      country_code:String,
      verification_code:String,
      palyer_id:String,
      //share_location:{ type: Boolean, default: true },
      //share_loc_flag_time:{ type: Date, default: Date.now },
      user_type:String,
      access_code:String,
      loc: {
        type: [Number],  // [<longitude>, <latitude>]
        index: '2d'      // create the geospatial index
        },
      //last_shared_loc_time: { type: Date, default: Date.now }
         
}, { timestamps: true });
// , { usePushEach: true }

UserSchema.index({email:1});
//userSchema.index({ loc: '2d' });
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function(token) {
  // mongoDB operatoe $pull
  var user = this;

  return user.update({
    $pull: {
        tokens: {
          token: token
        }
    }
  });
};

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;
  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentails = function(email, password){
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        }else {
          reject();
        }
      });
    });
  });
}

UserSchema.pre('save', function(next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
          next();
      });
    });
  }else {
    next();
  }
})
// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', UserSchema);

// make this available to our users in our Node applications
module.exports = User;