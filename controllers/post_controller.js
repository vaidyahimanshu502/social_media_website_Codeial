const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/likes');

module.exports.create = async function(req, res)
{
    try
    {
        let post = await Post.create
        (
            {
                content: req.body.content,
                user: req.user._id
            }
        )
    //Handeling AJAX request
        if(req.xhr) {
            return res.status(200).json({
                data : {
                    post:post
                },
                message: "Post Created!"
            })
        }
        req.flash('success', 'Post Published !')
        return res.redirect('back');
   }catch(error){
        //  console.log('error', error);
        req.flash('error', error);
        return res.redirect('back');
   }
}

module.exports.destroy = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);

        if(post.user == req.user.id) {

            await Like.deleteMany({likeable: post._id, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});
            await post.deleteOne();
            await Comment.deleteMany({post:req.params.id});

//checking request from AJAX
           if(req.xhr){
            return res.status(200).json({
                data: {
                    post_id:req.params.id
                },
                message: "Post Deleted !"
            })
           }
           req.flash('success', 'Post and associated comments deleted !')
            return res.redirect('back');

        }else{
            req.flash('error', 'You can not delete this post !');
            return res.redirect('back');
        }

    } catch (error) {
        req.flash('error', error);
    }
}