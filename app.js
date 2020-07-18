//required dependies
var express 		= require("express"),
	app 			= express(),
	bodyParser		= require("body-parser"),
	mongoose 		= require("mongoose"),
	flash			= require("connect-flash"),
	passport		= require("passport"),
	LocalStrategy 	= require("passport-local"),
	methodOverride  = require("method-override"),
	Campground		= require("./models/campground"),
	Comment			= require("./models/comment"),
	User			= require("./models/user"),
	seedDB			= require("./seed");

var commentRoutes 		= require("./routes/comments"),
	campgroundRoutes 	= require("./routes/campgrounds"),
	indexRoutes			= require("./routes/index");

//for seed data
//seedDB();

//passport configruation
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//for database creation and mongoose connection
mongoose.connect('mongodb+srv://projectDB:123qwe123@project-final-deploy.iethe.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

//for body-parser
app.use(bodyParser.urlencoded({extended: true}));

//to set every file is ejs at once.
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));

//for mrthod-override
app.use(methodOverride("_method"));

//for flash
app.use(flash());

//for extracting current user on navbar
app.use(function(req, res, next){
	res.locals.currentUser	= req.user;
	res.locals.error		= req.flash("error");
	res.locals.success		= req.flash("success");
	next();
});

//for using routes
app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds",campgroundRoutes);

//to start server
app.listen(3000, function(){
	console.log("server is ON!");
});