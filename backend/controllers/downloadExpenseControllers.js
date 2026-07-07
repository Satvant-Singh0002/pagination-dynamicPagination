const Expense= require('../models/expenseModels');

const downloadExpenses = async(req,res)=>{
    try{
        console.log(req.user);
        const expenses= await Expense.findAll({
            where:{
                userId:req.user.userId
            }
        });
        let csv="Amount,Description,Category\n";
        expenses.forEach(expense=>{
            csv+=`${expense.expenseAmount},${expense.description},${expense.category}\n`;
        });
           res.setHeader(
            "Content-Disposition",
            "attachment; filename=expenses.csv"
        );

        res.setHeader("Content-Type", "text/csv");

        res.send(csv);

    }catch(error){
        console.log(error);
         res.status(500).json({
            message: "Download failed"
        });
        
    }
}

module.exports={
    downloadExpenses
}