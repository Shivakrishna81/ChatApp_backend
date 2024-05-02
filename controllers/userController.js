const userObject = require("../model/userModel")
const bcrypt = require("bcrypt")


module.exports.register = async (req, res, next) => {
    try {
        const { password, email, username } = req.body;
        const validateUsername = await userObject.findOne({ username });
        const validateEmail = await userObject.findOne({ email });
        if (validateUsername) {
            return res.json({ message: "Username Already Exists", status: false });
        }
        if (validateEmail) {
            return res.json({ message: "Email already exists", status: false })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await userObject.create({
            email,
            username,
            password: hashedPassword
        });
        delete user.password;
        return res.json({
            status: true, user
        })
    }
    catch (err) {
        next(err)
    }
}   


module.exports.login = async (req, res, next) => {
    try {
        const { password, username } = req.body;
        const validateUsername = await userObject.findOne({ username });
        
        if (!validateUsername) {
            return res.json({ message: "Incorrect Username", status: false });
        }
        
        const validatePassword=await bcrypt.compare(password,validateUsername.password)
        if (!validatePassword){
            return res.json({message:"Incorrect Password",status:false})
        }
        delete validateUsername.password;
        return res.json({status: true, validateUsername})

    }
    catch (err) {
        next(err)
    }
} 

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId=req.params.id;
        const avatarImg=req.body.image;
        const userData=await userObject.findByIdAndUpdate(userId,{
            isAvatarImageSet:true,
            avatarImg
        },{new:true});
        return res.json({isSet:userData.isAvatarImageSet,image:userData.avatarImg});

    }
    catch (err) {
        next(err)
    }
} 



module.exports.getAllUsers=async (req,res,next)=>{
    try{
        const users =await  userObject.find({_id:{$ne :req.params.id}}).select([
            "email",
            "username",
            "avatarImg",
            "_id"
        ])
        return res.json(users)
    }
    catch (err){
        next(err)
    }
}