const Post = require('../models/post')
const User = require('../models/user')
module.exports.home= async (req, res) =>{
    // return res.end('<h1>Express is up for Codial !!</h1>')
    // console.log(req.cookies);
    // res.cookie('user_id', 25);
    try {
        // let posts = await Post.find({});
        // return res.render('home', {
        //           title : "Codeial | Home",
        //           posts:posts
        //      })

 //rendering user's information with posts and comments we use populatwe
        let posts=await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate
        ({
            path: 'comments',
            populate:
            {
                path: 'user'
            }
        })
        .populate
        ({
            path: 'comments',
            populate:
            {
                path: 'likes'
            }
        })
        .populate('likes')
        .exec();

        let users = await User.find({});
        
        return res.render('home',
        {
            title: 'Codeial | Home',
            posts: posts,
            all_users: users
        });
 
            
    } catch (error) {
        console.log('error', error);
    }
}