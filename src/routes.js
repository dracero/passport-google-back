const express = require('express')
var router = express.Router();

//Define the Login Route
router.get("/login", (req, res) => {
    res.render("pages/login.ejs")
})


//Define the Protected Route, by using the "checkAuthenticated" function defined above as middleware
router.get("/dashboard",(req, res) => {
  if(res.locals.authenticated){
        res.render("pages/dashboard.ejs", {name: req.user.displayName})
  }
  else{
    res.send('sin logearse')
  }      
})

router.get("/check", (req, res) => {
  if(res.locals.authenticated){ 
    res.send("Funciona")
  }
  else{
    res.send('sin logearse')
  }  
})

//Define the Logout
router.post("/logout", (req,res) => {
    req.logOut()
    res.redirect("/login")
    console.log(`-------> User Logged out`)
})

module.exports = router