const User = require('../models/user');
const Friendship = require('../models/friendship');

module.exports.addFriends = async (req, res) => {
    try {
        console.log('here');
        let existingFriend = Friendship.findOne({
            from_user: req.user,
            to_user: req.query.id
        });

        let fromUser = await User.findById(req.query.id);
        let toUser = await User.findById(req.user);

        let deleted = false;

        if(existingFriend) {

            fromUser.friendship.pull(existingFriend._id);
            toUser.friendship.pull(existingFriend._id);

           await fromUser.save();
           await toUser.save();

            existingFriend.deleteOne();
            deleted = true;
            removeFriend = true;

            if(req.xhr) {

                return res.status(200).json({
    
                    deleted: deleted,
                    message: 'Request Successful !'
    
                });
               }

        } else {

           let friend =await Friendship.create({

            from_user: req.user._id,
            to_user: req.query.id

           });

           fromUser.friendship.push(friend);
           toUser.friendship.push(friend);

          await fromUser.save();
          await  toUser.save();

           if(req.xhr) {

            return res.status(200).json({

                deleted: deleted,
                message: 'Request Successful !'

            });
           }

           return res.redirect('back', {});

        }

    } catch (error) {

        console.log('Error :', error);
        
    }
}