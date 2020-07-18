var express 	= require("express");
var router 		= express.Router();
var passport 	= require("passport");
var User 		= require("../models/user");

//landing page - first page
router.get("/", function(req, res){
	res.render("landing");
});

//authentication routes
	//show register form
router.get("/register", function(req,res){
	res.render("register");
});
	
	//handle signup logic
router.post("/register", function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.render("register");
		}else{
			passport.authenticate("local")(req, res, function(){
				req.flash("success","Wellcome To yelpcamp "+ user.username);
				res.redirect("/campgrounds");
			});
		}
	});
});
	//show login form
router.get("/login", function(req, res){
	res.render("login");
});

	//handeling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){	
});

	//log out routes
router.get("/logout", function(req, res){
	req.flash("error", "Logged You Out!");
	req.logout();
	res.redirect("/campgrounds");
});


module.exports = router;