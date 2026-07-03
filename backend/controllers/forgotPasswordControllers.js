// const SibApiV3Sdk = require('sib-api-v3-sdk');
// const forgotPassword=async(req,res)=>{
//     try{
//         const {email}=req.body;
//         const defaultClient = SibApiV3Sdk.ApiClient.instance;

//         const apiKey = defaultClient.authentications["api-key"];
//         apiKey.apiKey = process.env.BREVO_API_KEY;
//           // Create Transactional Email API instance
//         const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
//         //Create email object
//         const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

//        sendSmtpEmail.subject ="forgot password";
//        sendSmtpEmail.htmlContent = `<h2>Hi Satvant Singh</h2>`;

//        sendSmtpEmail.sender = {
//         name:"Expense Tracker",
//         email:"iassatvant158@gmail.com"
//        };

//        sendSmtpEmail.to =[{
//         email:email
//        }];
//         await apiInstance.sendTransacEmail(sendSmtpEmail);
//          return res.status(200).json({
//             message: "Email sent successfully"
//         });


//     }catch(err){
//         console.error(err);
//           return res.status(500).json({
//             message: "Failed to send email"
//         });
//     }

// }
// module.exports={
//     forgotPassword
// }

const { v4: uuidv4 } = require("uuid");
const SibApiV3Sdk = require("sib-api-v3-sdk");

const User = require("../models/userModels");
const Forgotpassword = require("../models/forgotPasswordRequestModels");

const forgotPassword = async (req, res) => {
    try {
         console.log("BODY:", req.body);

        const email = req.body.email.trim();

        console.log("EMAIL:", email);
   

        const user = await User.findOne({
            where: { email }
        });
        console.log("USER RESULT:", user);  

        if (!user) {
             console.log("NO USER FOUND FOR EMAIL:", email);
            return res.status(404).json({
                message: "User not found"
            });
        }

        const id = uuidv4();

        await Forgotpassword.create({
            id,
            userId: user.id,
            active: true,
            expiresby: new Date(Date.now() + 15 * 60 * 1000)
        });

        const defaultClient = SibApiV3Sdk.ApiClient.instance;
        defaultClient.authentications["api-key"].apiKey =
            process.env.BREVO_API_KEY;

        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        sendSmtpEmail.sender = {
            name: "Expense Tracker",
            email: "iassatvant158@gmail.com"
        };

        sendSmtpEmail.to = [
            {
                email
            }
        ];

        sendSmtpEmail.subject = "Reset Password";

        sendSmtpEmail.htmlContent = `
            <h2>Password Reset</h2>

            <p>Click the link below to reset your password.</p>

            <a href="http://localhost:4000/password/resetPassword/${id}">
                Reset Password
            </a>
        `;

        await apiInstance.sendTransacEmail(sendSmtpEmail);

        res.status(200).json({
            message: "Reset link sent successfully"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

module.exports = {
    forgotPassword
};