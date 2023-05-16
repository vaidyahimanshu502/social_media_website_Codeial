const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/likes');
const commentsMailer = require('../mailers/comments_mailer');
const commentMailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');


module.exports.create = async (req, res) => {
    try {
        let post = await Post.findById(req.body.post);

        if(post) {
            let comment = await Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            })

            //adding comment in the comments array of post
            post.comments.push(comment);
            post.save();

           comment = await comment.populate('user', 'name email');
        //    commentsMailer.newComment(comment);

        let job = queue.create('emails', comment).save(function(err){

            if(err) {
                console.log('error in creating a queue.',err);
            }
            console.log(job.id);
        });
        
    //checking for ajax call
            if(req.xhr){

                return res.status(200).json({
                    data:{
                        comment:comment
                        // name :  comment.user.name
                    },message :"Comment created !"
                })
            }
            return res.redirect('/');
        }
    } catch (error) {
        console.log('error', error);
    }
}

module.exports.destroy = async (req, res) => {
   try {
    //deleting from comment schema
    let comment = await Comment.findById(req.params.id);
    if(comment.user == req.user.id) {
        let postId = comment.post;
        comment.deleteOne();
      
        //deleting from post Schema
        await Post.findByIdAndUpdate(postId, {
            $pull : {
                comments:req.params.id
            }
        })
        await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
// checking for ajax request
        if(req.xhr){
            return res.status(200).json({
                data: {
                    comment_id:req.params.id
                },message : "Comment deleted"
            });
        }

        return res.redirect('back')
    } else {
        return res.redirect('back')
    }
   } catch (error) {
    console.log('error', error);
   }
}