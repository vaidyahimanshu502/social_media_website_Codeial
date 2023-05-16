const nodemailer = require('../config/nodemailer');

//this is another method to export [es6 feature]
exports.newComment = async (comment) => {
    // console.log('inside newComment mailer');

//for sending ejs in mail
    let htmlString =await nodemailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    let info =await nodemailer.transporter.sendMail({
        from : 'vaidyahimanshu502@gmail.com',
        to : comment.user.email,
        subject :'New Comment Published !',
        html : htmlString
    });
    if(!info) {
        console.log('Error in sending mail !');
        return
    }
    console.log('Message send :', info);
    return
};