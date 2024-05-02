const mongoose=require("mongoose")


const registerSchema=new mongoose.Schema({
    username:{
        type: String,
        unique:true,
        required:true,
        min:3,
        max:20
    },

    email:{
        type:String,
        unique:true,
        required:true,
        max:50,
    },

    password:{
        type:String,
        unique:true,
        required:true,
        max:15,
    },
    isAvatarImageSet:{
        type:Boolean,
        default:false,
    },
    avatarImg:{
        type:String,
        default:"",
    }

})


module.exports=mongoose.model("Users",registerSchema);


