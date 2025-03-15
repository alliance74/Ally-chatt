import jwt from 'jsonwebtoken';

export const generateToken= (userId, res) =>{


    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn:"10d"
    });

//sending token in cookie
res.cookie("jwt", token,{
    maxage: 10*24*60*60*1000,
    httpOnly:true,// if you want to prevent client side javascript from reading the cookie(xss attacks)
    sameSite:"strict",
    secure:  process.env.NODE_ENV === "development" 
})
return token;
}