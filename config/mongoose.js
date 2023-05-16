const mongoose = require('mongoose');
const env = require('./environment');
// mongoose.connect('mongodb+srv://vaidyahimanshu502:<Vaidya@>1996@codeial-development.r1v3e9u.mongodb.net/codeil_development')
mongoose.connect(`mongodb://127.0.0.1:27017/${env.db}`);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'An error occured to connecting with DataBase !'));
db.once('open', function() {
    console.log("Connected with DataBase :: MongoDB");
})

module.exports = db;