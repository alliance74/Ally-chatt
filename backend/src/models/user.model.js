import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {
email:{
    type:String,
    required:true,
    unique:true,
},
fullName:{
    type:String,
    required:true,
},


password:{
    type:String,
    required:true,
    minlength:6,
},
profilePic:{
    type:String,
    default:"https://res.cloudinary.com/dmjhisgh5/image/upload/v1740862097/rz18ibte6wfvuzfhr4ol.jpg",
},

},
{timestamps:true}
); 
const User = mongoose.model("User", userSchema);
export default User;

