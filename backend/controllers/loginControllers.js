const db= require('../utils/db-connection');
const User=require('../models/userModels');
const bcrypt = require('bcrypt');
const login=async(req,res)=>{
 
    try {
        const {email,password}=req.body;

        const user=await User.findOne({
            where:{email}
        });
        if(!user){
            return res.status(404).json({
                message:"user not found"
            });
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(isMatch){
            return res.status(200).json({
                message:'user logged successfully'
            })
        }else{
            res.status(401).json({
                message:'invalid credentials'
            })
        }

        
    } catch (error) {
        res.status(500).json({
            message:"something went wrong"
        })
        console.log(error)
        
    }
}
module.exports={
    login
}