const express     = require("express"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    multer        = require("multer"),
    path          = require("path"),
    session       = require("express-session"),
    bodyParser    = require("body-parser"),
    flash         = require("connect-flash"),
    User          = require("./app/models/user.js"),
    configDB      = require('./config/database.js');

const storage = multer.diskStorage({
    destination: './public/images/',
    filename: function(req, file, cb){
        cb(null,file.fieldname + '-' + req.user.credentials.email + path.extname(file.originalname));
    }
});
    
const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
}).single('image');
    
function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
      
    if(mimetype && extname){
        return cb(null,true);
    } else {
        cb('Error: Only image files can be made profile pictures.');
    }
}    
    
const app = express();
const port = process.env.PORT || 4200;
mongoose.connect(configDB.url);

require('./config/passport.js')(passport);

app.set("view engine", "ejs");
app.use(session({
    secret: 'mydongisverylongthankyousir'
}));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
      return next();
    }
    res.redirect('/donors/login');
}
  
function isNotLoggedIn(req,res,next){
    if(!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
}

app.get("/",(req, res) => {
    let user = req.user;
    res.render("landing",{
        user : user
    });
});

app.get("/donors/profile/",isLoggedIn,(req,res)=>{
    let user = req.user;
    res.render("profile_donor",{
        user:user
    });
});

app.get("/donors/profile/edit",isLoggedIn,(req,res)=>{
    let date = new Date();
    let currentYear = date.getFullYear();  
    let user = req.user;  
    res.render("profile_edit_donor",{
        user:user,
        message: req.flash('updateMessage'),
        currentYear: currentYear
    });
});

app.post("/donors/profile/edit", isLoggedIn, (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            let date = new Date();
            let currentYear = date.getFullYear();
            req.flash('updateMessage', err);
            res.render("profile_edit_donor", {
                user: req.user,
                message: req.flash('updateMessage'),
                currentYear: currentYear
            });
            return
        }
        if (req.user.validPassword(req.body.currentPassword)) {
            console.log(req.file);
            let user = req.user;
            let dob = new Date(req.body.DOBYear + "/" + req.body.DOBMonth + "/" + req.body.DOBDay);
            user.credentials.email = req.body.email.trim();
            user.credentials.password = user.generateHash(req.body.newPassword);
            user.profilePicturePath = typeof req.file != "undefined" ? `/images/${req.file.filename}` : req.user.profilePicturePath;
            user.gender = req.body.gender;
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.bloodGroup = req.body.bloodGroup;
            user.dateOfBirth = dob;
            user.mobileNumber = req.body.mobileNumber;
            user.save();
            res.redirect("/donors/profile");
        } else {
            let date = new Date();
            let currentYear = date.getFullYear();
            req.flash('updateMessage', 'Passwords do not match')
            res.render("profile_edit_donor", {
                user: req.user,
                message: req.flash('updateMessage'),
                currentYear: currentYear
            });
        }
    })
});

app.get("/donors/search", (req, res) => {
    let user = req.user;
    res.render("find_donor",{
        user:user
    });
})

app.get("/donors/register",isNotLoggedIn,(req, res) => {
    let date = new Date();
    let currentYear = date.getFullYear();
    res.render("register_donor",{
        message: req.flash('signupMessage'),
        currentYear: currentYear
    });
});

app.get("/donors/login",isNotLoggedIn,(req,res)=>{
    res.render("login_donor",{
        message: req.flash('loginMessage')
    });
})

app.post("/donors/search", (req, res) => {
    let bloodGroup = req.body.bloodGroup;
    let gender = req.body.gender;

    User.find({
        bloodGroup: bloodGroup,
        gender: gender
    }, (err, users) => {
        if (err) throw err;
        res.render("find_donor", {
            users: users
        });
    })
});

app.get('/donors/logout',isLoggedIn,function (req, res) {
    req.logout();
    res.redirect('/');
});

app.post('/donors/register',isNotLoggedIn, passport.authenticate('local-signup', {
    successRedirect: '/donors/profile' , // redirect to the secure profile section
    failureRedirect: '/donors/register', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));

app.post('/donors/login',isNotLoggedIn,passport.authenticate('local-login', {
    successRedirect: '/', // redirect to the secure profile section
    failureRedirect: '/donors/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));


app.listen(port, () => console.log("Listening at port : " + port));