var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../app/models/user');

module.exports = (passport)=>{
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

passport.use('local-login', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
  },
  function(req, email, password, done) { 
      User.findOne({ 'credentials.email' :  email.trim() }, function(err, user) {
          if (err)
              return done(err);

          if (!user)
              return done(null, false, req.flash('loginMessage', 'No user found.'));

          if (!user.validPassword(password))
              return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); 
          return done(null, user);
      });

  }));

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        process.nextTick(function() {
        User.findOne({ 'credentials.email' :  email }, function(err, user) {
            if (err)
                return done(err);

            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
                let newUser = new User();
                let dob = new Date(req.body.DOBYear + "/" + req.body.DOBMonth + "/" + req.body.DOBDay);
                newUser.credentials.email = email.trim();
                newUser.credentials.password = newUser.generateHash(password);
                newUser.gender = req.body.gender;
                newUser.firstName = req.body.firstName;
                newUser.lastName = req.body.lastName;
                newUser.bloodGroup = req.body.bloodGroup;
                newUser.dateOfBirth = dob;
                newUser.mobileNumber = req.body.mobileNumber;
                newUser.save(function (err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });
      });
    }));
};
