const nodeMailer = require('../config/nodemailer');

exports.resetPassword = async (user) => {
    // console.log('inside newComment mailer');

//for sending ejs in mail
    let htmlString =await nodeMailer.renderTemplate({user : user}, '/users/password_reset.ejs');

    let info =await nodeMailer.transporter.sendMail({
        from : 'vaidyahimanshu502@gmail.com',
        to : user.email,
        subject :'Reset Your Password !',
        html : htmlString
    });
    if(!info) {
        console.log('Error in sending mail !');
        return
    }
    console.log('Message send :', info);
    return
};