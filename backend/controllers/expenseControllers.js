const db=require('../utils/db-connection');
const Expense=require('../models/expenseModels');


const addExpense = async(req,res)=>{
    try{
        const {expenseAmount,description,category}=req.body;

        const  expense = await Expense.create({
            expenseAmount:expenseAmount,
            description:description,
            category:category,
             userId: req.user.userId 
        })
         res.status(201).json(expense);
    }catch(error){
        console.log(error);
        res.status(500).send("error while adding expense");

    }

}
const getExpense=async(req,res)=>{
   
    try {
         const expenses=await Expense.findAll(
            {
    where: {
        userId: req.user.userId
    }
}
         );

    res.status(200).json(expenses);
    } catch (error) {
        console.log(error);
        res.status(500).send('error while fetching expenses');
        
    }

}
const deletExpense=async(req,res)=>{
    try {
        const expenseId=req.params.id;
        await Expense.destroy({
            where:{
                id: expenseId
            }
        });
        res.status(200).json({
            message:"Expense deleted successfully"
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"error while deleting expense"
        })
    }
}
module.exports={
    addExpense,
    getExpense,
    deletExpense
}