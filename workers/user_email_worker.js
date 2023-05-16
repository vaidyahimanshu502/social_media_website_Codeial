const queue = require('../config/kue');
const userMailer = require('../mailers/user_mailer');

queue.process('user-emails',  (job, done) => {
      console.log('users-email worker is proccessing a job', job.data);
      userMailer.resetPassword(job.data);

    done();

});