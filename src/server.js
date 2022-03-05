const express = require('express')
const app = express()
const path = require('path');
var cors = require('cors')
require('dotenv').config()
const session = require('express-session')
const passport = require('passport')
var cookieParser = require('cookie-parser')
app.use(cookieParser());
const MongoStore = require('connect-mongo')
require('./config/database')
//const docente = require ('./models/users')
const  jwt = require("jsonwebtoken");

// set the view engine to ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors())

const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

//Middleware sesssion persists in Mongo
app.use(session({
  store: MongoStore.create({ 
    mongoUrl: `${process.env.MONGO_URL}`,
    ttl: 60 * 10 
  }),
  secret: 'secreto',
  resave: true,
  saveUninitialized: true,
}))


app.use(passport.initialize()) // init passport on every route call
app.use(passport.session())    //allow passport to use "express-session"


//Get the GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from Google Developer Console
const GOOGLE_CLIENT_ID = "89629888591-uj0tg9t0qsd2eq9aodmts8hbtarj7ohf.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"

authUser = (request, accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }

//Use "GoogleStrategy" as the Authentication Strategy
passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback",
    passReqToCallback   : true
  }, authUser));


passport.serializeUser( async (user, done) => { 
    console.log(`\n--------> Serialize User:`)
    console.log(user)
    // The USER object is the "authenticated user" from the done() in authUser function.
    // serializeUser() will attach this user to "req.session.passport.user.{user}", so that it is tied to the session object for each session.  

    done(null, user)
} )


passport.deserializeUser((user, done) => {
        console.log("\n--------- Deserialized User:")
        console.log(user)
        // This is the {user} that was saved in req.session.passport.user.{user} in the serializationUser()
        // deserializeUser will attach this {user} to the "req.user.{user}", so that it can be used anywhere in the App.

        done (null, user)
}) 

app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));



app.get(
  '/auth/google/callback',
  passport.authenticate("google"),
  function (req, res) {
    if (req.user) { 
       const token = jwt.sign({id: req.user.email}, 'top_secret', {
        expiresIn: 60 * 60 * 24 // equivalente a 24 horas
      })
      res.cookie('token', token)        
      //res.redirect('http://localhost:3000/Check')
      res.send('funciona')
    } else {
      //res.redirect('http://localhost:3000/')
      res.send('remal')
    } 
  }
);

app.use((req, res, next) => {
    res.locals.authenticated = req.isAuthenticated();
  next();    
  });

const LogRoutes = require('./routes')
app.use('/', LogRoutes)

//Start the NODE JS server
app.listen(8080, () => console.log(`Server started on port 8080...`))


