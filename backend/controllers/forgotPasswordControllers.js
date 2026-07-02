const SibApiV3Sdk = require('sib-api-v3-sdk');
const forgotPassword=async(req,res)=>{
    try{
        const {email}=req.body;
        const defaultClient = SibApiV3Sdk.ApiClient.instance;

        const apiKey = defaultClient.authentications["api-key"];
        apiKey.apiKey = process.env.BREVO_API_KEY;
          // Create Transactional Email API instance
        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        //Create email object
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

       sendSmtpEmail.subject ="forgot password";
       sendSmtpEmail.htmlContent = `<h2>Hi Satvant Singh</h2>`;

       sendSmtpEmail.sender = {
        name:"Expense Tracker",
        email:"iassatvant158@gmail.com"
       };

       sendSmtpEmail.to =[{
        email:email
       }];
        await apiInstance.sendTransacEmail(sendSmtpEmail);
         return res.status(200).json({
            message: "Email sent successfully"
        });


    }catch(err){
        console.error(err);
          return res.status(500).json({
            message: "Failed to send email"
        });
    }

}
module.exports={
    forgotPassword
}