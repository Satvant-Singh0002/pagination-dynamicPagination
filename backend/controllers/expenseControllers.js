const db=require('../utils/db-connection');
const Expense=require('../models/expenseModels');

const addExpense = async(req,res)=>{
    try{
        const {expenseAmount,description,category}=req.body;

        const  expense = await Expense.create({
            expenseAmount:expenseAmount,
            description:description,
            category:category
        })
         res.status(201).json(expense);
    }catch(error){
        console.log(error);
        res.status(500).send("error while adding expense");

    }

}
const getExpense=async(req,res)=>{
   
    try {
         const expenses=await Expense.findAll();

    res.status(200).json(expenses);
    } catch (error) {
        console.log(error);
        res.status(500).send('error while fetching expenses');
        
    }

}
module.exports={
    addExpense,
    getExpense
}