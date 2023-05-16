const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const env = require('./environment')


let transporter = nodemailer.createTransport(env.smtp);

let renderTemplate = async (data, relatibePath) => {
    try {
//joining path with ejs file
        var mailHTML =await ejs.renderFile(path.join(__dirname, '../views/mailers', relatibePath),
        data);
        if(!mailHTML) {
            console.log('Error in rendering template !');
        }
     return mailHTML;
    } catch (error) {
        console.log('Error', error);
    }
}

module.exports = {
    transporter : transporter,
    renderTemplate : renderTemplate
}