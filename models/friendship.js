const mongoose = require("mongoose");

const friendshipsSchema = new mongoose.Schema({
    from_user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users"
    } , 
    to_user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users"
    } , 
} , {
    timeStamps : true
})

const Friendships = mongoose.model("Friendships" , friendshipsSchema);
module.exports = Friendships;