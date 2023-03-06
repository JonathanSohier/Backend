const express = require('express');
const blog = require('./src/blog/router');
const profile = require('./src/profile/router');
const account = require('./src/account/router');
const cookieSession = require('cookie-session');
require('./src/auth_providers/passport');
const res = require("express/lib/response");
const authenticate = require("./middlewares/authenticate");
const db = require('./db');
const passport = require('passport');
require("dotenv").config();

const app = express();

db.connect();

let port=3001;

app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/blog', blog);
app.use('/profile', profile);
app.use('/account', account);
app.use('/auth', require('./src/auth_providers/router'));

app.use(
    cookieSession({ 
      name: "google-auth-session",
      keys: ["key1","key2"],
    }),
);  
  
const routes = [
    {
        path:"/auth", 
        router:require("./src/auth_providers/router"), 
        secure:false},
    {
        path: "/account",
        router: require("./src/account/router"),
        secure: false,
    },
    { 
        path: "/blog", 
        router: require("./src/blog/router"), 
        secure: true },
    { 
        path: "/profile", 
        router: require("./src/profile/router"), 
        secure: true },
];

routes.forEach((route) => {
    if (route.secure) {
        return app.use(route.path, authenticate, route.router);
    }

    app.use(route.path, route.router);
});


app.listen(port, () => {
console.log(`Server running on port http://localhost:${port}`);
});
