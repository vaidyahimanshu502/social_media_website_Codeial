const express = require('express');
require('dotenv').config()
const env = require('./config/environment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const expressLayouts =require('express-ejs-layouts');

const db = require('./config/mongoose');
//configuration of passport.js
const session = require('express-session')
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2');
const mongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const flashMware = require('./config/middleware');
const path = require('path');
const cors = require('cors');

const port = 8000;
const app = express();
// accessing gulp files from helper function
require('./config/view-helpers')(app);

//set up the chat server using express server
const chatServer = require('http').Server(app);
const chatSocket = require('./config/chat_socket').chatSockets(chatServer);
chatServer.listen(5000);
console.log('Chat server is running on port 5000')

app.use(cors());

//adding check for if dev mode then load saass again and again
if(env.name == 'development') {
    app.use(sassMiddleware(
        {
        src: path.join(__dirname, env.asset_path, 'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'), 
        debug:true,
        outputStyle:'extended',
        prefix:'/css'
       }
     )
  );
}

//to encode URL
app.use(express.urlencoded());

//for cookie parser
app.use(cookieParser());

//accessing static files
app.use(express.static(env.asset_path));
//for reading Avtar Path and make the uploaded file available for browser
app.use('/uploads', express.static(__dirname + '/uploads'))

//logger setup
app.use(logger(env.morgan.mode, env.morgan.options));

//setup my layout
app.use('/',expressLayouts);

//for accessing different static files in different pages
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//to setting our view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//creating authentication by passport
//mongo store used to store the session cookie in the db
app.use(session
    ({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: 
    {
        maxAge: (1000 * 60 * 100)
    },
    store : mongoStore.create(
          {
            mongoUrl: 'mongodb://127.0.0.1:27017/codeil_development',
            autoRemove:'disabled'
          },
        function(err) {
            console.log(err || 'Connected to mongodb successfully !!');
        }
    )
}))
app.use(passport.initialize());
app.use(passport.session());

//set authentication from passport
app.use(passport.setAuthenticatedUser);

//to set flash middleware
app.use(flash());
app.use(flashMware.setFlash);

//setup router middleware
app.use('/', require('./routes/index'));

app.listen(port, function(err){
    if (err) {
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`Server is running on port : ${port}`);
})