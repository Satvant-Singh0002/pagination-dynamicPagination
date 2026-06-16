const db=require('../utils/db-connection');
const User=require('../models/userModels');
const bcrypt=require('bcrypt');
const  addUser=async (req,res)=>{
    try {
        const {name,email,password}=req.body;
        const existingUser= await User.findOne({
            where:{email}
        });
        if(existingUser){
            return res.status(409).json({
                message:"User already exists"
            });
        }
         const hashedPassword=await bcrypt.hash(password,10);
         const user = await User.create({
            name:name,
            email:email,
            password:hashedPassword
         })
         res.status(201).json({
            message:"signup successfully"
         })
        
    } catch (error) {
        console.log(error);
        res.status(500).send('error while signup user')
        
    }
}
module.exports={
    addUser
}