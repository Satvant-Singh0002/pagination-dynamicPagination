
const Forgotpassword = require("../models/forgotPasswordRequestModels");

const resetPassword=async(req,res)=>{

    try{
        const {id}=req.params;
        const request = await Forgotpassword.findOne({
            where:{
                id,
                active:true
            }
        });
        if(!request){
            return res.status(404).json({message:"Reset request not found"});
        }

         if (request.expiresby && request.expiresby < new Date()) {
            request.active = false;
            await request.save();

            return res.status(400).send("Reset link has expired.");
        }

        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Reset Password</title>
            </head>
            <body>
                <h2>Reset Password</h2>

                <form action="/update/updatepassword/${id}" method="POST">
                    <input
                        type="password"
                        name="newpassword"
                        placeholder="Enter New Password"
                        required
                    />
                    <br><br>
                    <button type="submit">Update Password</button>
                </form>
            </body>
            </html>
        `);

    }catch(error){
         console.error(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });

    }
}
module.exports={
    resetPassword
}