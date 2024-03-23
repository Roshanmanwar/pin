const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    userName:{
        type : String,
        required: true,
        unique:true,
    },
    password:{
        type:String,
        required: true,
    },
    posts:[{
        type : mongoose.Schema.Types.ObjectId,
        ref:'post',
    }],
    dp:{
        type : String,
    },
    email:{
        type : String,
        required : true,
        unique : true,
    },
    fullName:{
        type :String,
        required: true,
    },
});


const userModel = mongoose.model("user",userSchema);

module.exports = userModel;