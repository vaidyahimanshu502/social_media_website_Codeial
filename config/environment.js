const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');


const logDirectory = path.join(__dirname, '../production_log');

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

// console.log(process.env.GOOGLE_CLIENT_ID);
const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'blahSomething',
    db:'codeil_development',
    smtp: {
        service : 'gmail',
        host : 'smtp.gmail.com',
        port : 587,
        secure : false,
        auth : {
            user : 'vaidyahimanshu502@gmail.com',
            pass :'lqoqgsuwyyoigfsi'
        }
    },
    google_client_id:"204369490713-qd6ejt950r1jtj2balbo041vlrjrkh7t.apps.googleusercontent.com",
    google_client_secret:"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",
    google_callback_URL:"http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'codeial',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}

const production = {
    name: 'production',
    asset_path: process.env.ASSET_PATH,
    session_cookie_key: process.env.SESSION_COOKIE_KEY,
    db: process.env.DB,
    smtp: {
        service : 'gmail',
        host : 'smtp.gmail.com',
        port : 587,
        secure : false,
        auth : {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS,
        }
    },
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    google_callback_URL: process.env.GOOGLE_CLIENT_URL,
    jwt_secret: process.env.JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}


//module.exports = development
module.exports = eval(process.env.NODE_ENV) == undefined ? development : eval(process.env.NODE_ENV);


