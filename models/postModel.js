const mongoose = require('mongoose');

const postSchema = mongoose.Schema({

    postText:{
        type : String,
        required : true,
    },
    image:{
        type:String,
    },
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref:'user',
    },
    createdAt:{
        type : Date,
        default : Date.now,
    },
    likes:{
        type :Array,
        default:[],
        
    },

});


const postModel = mongoose.model("post",postSchema);

module.exports = postModel;