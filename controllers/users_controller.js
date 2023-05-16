const User = require("../models/user");
const fs= require('fs');
const path = require('path');
const crypto = require('crypto');
const queue = require('../config/kue');
const userEmailWorker = require('../workers/user_email_worker');
const Friendship = require("../models/friendship");

module.exports.profile = async (req, res) =>
{
   try {
    let user =await User.findById(req.params.id);

    let friend1, friend2;

    friend1 = await Friendship.findOne({

      from_user: req.user,
      to_user: req.params.id

    });

    friend2 = await Friendship.findOne({

      from_user: req.params.id,
      to_user: req.user

    });

    let populated_user = await User.findById(req.user)
    .populate('friendship');

        return res.render('user_profile',
        {
            title: 'Codeial | Profile',
            profile_user:user,
            populated_user
        });
   } catch (error) {
    console.log('error', error)
   }

  //before showing user's friends
          // User.findById(req.params.id);
          // return res.render('user_profile',
          // {
          //     title: 'Codeial | Profile',
          //     user:user
          // });
    };

//for updating
module.exports.update = async (req, res) => {
  // try {
  //   if(req.user.id == req.params.id) {
  //     await User.findByIdAndUpdate(req.params.id, req.body);
  //     return res.redirect('back');
  //   }else{
  //     return res.status(401).send('Unauthorized Person !')
  //   }
  // } catch (error) {
  //   console.log('error', error);
  // }
  if(req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      console.log(req.body)
      User.uploadedAvatar(req, res, function(err){
        if(err){ console.log('****Multer Error :', err)};
                user.name = req.body.name;
                user.email = req.body.email;
        // console.log(req.file);
        if(req.file){
//if profile picture or  avatar already exist then just delete the previous one and add new
          if(user.avatar){
            fs.unlinkSync(path.join(__dirname,'..', user.avatar));
          }
//this is saving the path of the uploaded file into the avatar field of user
           user.avatar = User.avatarPath + '/' + req.file.filename;
        }
        user.save();
        return res.redirect('back');
      })
    } catch (error) {
      req.flash('error',error);
      return res.redirect('back');
    }

  }else{
    req.flash('error', 'Undefined!');
    return res.status(401).send('Unauthorized!');
  }

}

// for sign up
module.exports.signUp = (req, res) => {

  if(req.isAuthenticated()){
    return res.redirect('/users/profile');
  }

  return res.render("user_sign_up", {
    title: "Codeial | Sign Up",
  });
};
//for sign in
module.exports.signIn = (req, res) => {

  if(req.isAuthenticated()){
    return res.redirect('/users/profile');
  }

  return res.render("user_sign_in", {
    title: "Codeial | Sign In",
  });

};


module.exports.create = async (req, res) => {
  try {
     if (req.body.password != req.body.confirm_password) {
         return res.redirect("back");
    }

     var user = await User.findOne({ email: req.body.email });
            if (!user) {
            await User.create(req.body);
            } else {
                req.flash('error', 'User is Alredy Present ! Please Sign-In !')
                console.log('User is already present !!')
            }
            req.flash('success', 'You have Signed-Up Successfully !')
            return res.redirect("/users/sign-in");

  } catch (error) {
    console.log("Error", error);
  }
};

//for log in 
module.exports.createSession = function (req, res) {

   req.flash('success', 'You have Logged-In !')
   return res.redirect('/');
  
}


//for log out 
module.exports.destroySession = function (req, res) {

  // .logout() provided by the passport.js
  req.logout(function(err){
    if(err){
      console.log("Something Went wrong !")
    }
  });
    req.flash('success', 'You have Logged-Out !')
   return res.redirect('/');
};

//for resetting password
module.exports.resetPassword =  (req, res) => {
  return res.render('reset_password', {
    title : 'Password | Reset',
    access : false
  });
}

//sending reset pass link via mail
module.exports.resetPassMail = async (req, res) => {

  try {

    let user = await User.findOne({email : req.body.email});
    if(!user) {

      console.log('Error in finding user !')
      return;

    }else{

      if(user.isTokenValid == false) {
        user.accessToken = crypto.randomBytes(30).toString('hex');
        user.isTokenValid = true,
        user.save();

      }

      let job = queue.create('user-emails', user).save((err)=>{

        if(err) {

          console.log('Error in sending to queue', err);
          return

        }

        console.log('job enqueued :', job.id);

      })

      req.flash('Password reset link send to Your mail. Click to reset password!');
      return res.redirect('/');

    }
  } catch (error) {

    req.flash('Error', 'User not found. Try again !');
    console.log('Error', error);
    return res.redirect('back');

  }
}

//for set password
module.exports.setPassword = async (req, res) => {
  try {

    // console.log(req.params.accessToken);
    // console.log(req.body.accessToken);
    // console.log(accessToken);
    let user = await User.findOne({accessToken : req.params.accessToken});
    // console.log(user)

    if(!user) {
      console.log('Error in finding user !');
      return;
    }

    if(user.isTokenValid) {

      return res.render('reset_password', {
        title : 'Codeial | Reset_password',
        access : true,
        accessToken : req.params.accessToken
      });

    }else {
      console.log('Error in rendering page !!!')
    }

  } catch (error) {

    req.flash('Error', 'Link Expired!!');
    console.log('Error', error);
    return res.redirect('/users/reset-password');

  }
}

// updating password to dataBase
module.exports.updatePassword = async (req, res) => {
  try {

    let user = await User.findOne({accessToken : req.params.accessToken});

    if(!user) {
      console.log('Error in finding User !!');
      return;
    }

    if(user.isTokenValid) {

      if( req.body.newPass == req.body.confirmPass ) {

        user.password = req.body.newPass;
        user.isTokenValid = false;
        user.save();
        req.flash('Success', 'Password updated. Login now !')
        return res.redirect('/users/sign-in');

      }else{

        res.flash('error', 'Password don not matched !');
        return res.redirect('back');

      }
    }else{

       res.flash('error', 'Link expired !')
       return res.redirect('/users/reset-password !');

    }
    
  } catch (error) {
    
    console.log('Error', error);

  }
}