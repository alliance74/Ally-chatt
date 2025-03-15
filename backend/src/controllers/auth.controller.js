
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;

    try {
  
if(!email || !fullName || !password){
    return res.status(400).json({ message: "All fields are required" });

}

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Making password hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Creating new user
        const newUser = new User({
            email,
            fullName,
            password: hashedPassword,
        });

        await newUser.save(); // Save the new user to the database

        if (newUser) {
            generateToken(newUser._id, res);
            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                profilePic: newUser.profilePic,
            });
        } else {
            return res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("signup error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
        
const {email,password} = req.body

try {

const user= await User.findOne({email});

if(!user){
    return res.status(400).json({message:"Invalid credentials"})
 
}
  const ispasswordcorrect = await bcrypt.compare(password, user.password)
  if(!ispasswordcorrect){
    return res.status(400).json({message:"Invalid credentials"})
  }

  generateToken(user._id, res);
  res.status(200).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
  });
} catch (error) {
    res.status(500).json({message:"Server error"})
    
    
}



   
};

export const logout = (req, res) => {
 try {
    res.cookie("jwt", "", {maxAge: 0});
    res.status(200).json({message:"Logged out successfully"})   
 } catch (error) {
    res.status(500).json({message:"Internal Server error"})
 }
};


  

export const updateProfile = async (req, res) => {
    try {
      const { profilePic } = req.body;
      const userId = req.user._id;
  
      if (!profilePic) {
        return res.status(400).json({ message: "Profile pic is required" });
      }
  
      // Upload image to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(profilePic, {
        resource_type: "auto", // Automatically detects image type
      });
  
      // Update the user with the new profile picture URL
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url },
        { new: true }
      );
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.log("Error in update profile:", error); // Detailed logging for debugging
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("check auth error:", error.message);
        res.status(500).json({ message:  " Internal  Server error"});
        }

    }