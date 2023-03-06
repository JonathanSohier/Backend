const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const accountSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

accountSchema.pre('save',function(next){
    const account = this;

    if(!account.isModified('password')){
        next();
    }
    bcrypt.genSalt(10, function(err, salt){
        if(err) return next(err);

        bcrypt.hash(account.password, salt, function(err, hash){
            if(err) return next(err);

            account.password = hash;
            next();
        });
    });
});

accountSchema.methods.comparePassword = function ( candidatePassword, callback){
    bcrypt.compare(candidatePassword, this.password, function(err,isMatch){
        if(err) return callback(err);
        callback(null,isMatch);
    });
};

accountSchema.methods.generateJwt = function(){
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        exp: parseInt(expiry.getTime() / 1000),
    }, process.env.JWT_SECRET);
}

module.exports = mongoose.model("Account", accountSchema);