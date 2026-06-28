const db=require('../utils/db-connection');
const Expense=require('../models/expenseModels');
const User = require('../models/userModels');

const addExpense = async(req,res)=>{
    try{
        const {expenseAmount,description,category}=req.body;

        const  expense = await Expense.create({
            expenseAmount:expenseAmount,
            description:description,
            category:category,
             userId: req.user.userId 
        })

        await User.increment(
            {totalExpense:expenseAmount},
            {
                where:{
                    id:req.user.userId
                }
            }
        );
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
const deletExpense = async (req, res) => {
    try {

        const expenseId = req.params.id;

        // Fetch the expense first
        const expense = await Expense.findOne({
            where: {
                id: expenseId,
                userId: req.user.userId
            }
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        // Decrease totalExpense
        await User.decrement(
            {
                totalExpense: Number(expense.expenseAmount)
            },
            {
                where: {
                    id: req.user.userId
                }
            }
        );

        // Delete expense
        await expense.destroy();

        res.status(200).json({
            message: "Expense deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while deleting expense"
        });
    }
};
module.exports={
    addExpense,
    getExpense,
    deletExpense
}