var mongoose = require('mongoose');
var bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
    credentials : {
        email : {
            type: String, 
            required: true,
            unique: true
        },
        password : String
    },
    profilePicturePath : {
        type : String,
        default : '/images/defaultProfilePicture.jpeg'
    },
    gender: String,
    firstName: String,
    lastName: String,
    bloodGroup: String,
    dateOfBirth: Date,
    mobileNumber: String
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.credentials.password);
};

module.exports = mongoose.model("User", userSchema);

