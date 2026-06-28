const { Sequelize } = require("sequelize")
const Expense = require('../models/expenseModels'); 
const User  = require('../models/userModels');   
const  leaderBoard=async(req,res)=>{
    try {
        const leaderboard = await User.findAll({
            attributes:[
                'name',
                [Sequelize.fn('SUM',Sequelize.col('expenses.expenseAmount')),'totalExpense']
            ],
            include:[{
                model: Expense,
                attributes:[]


            }],
            group:['User.id'],
            order:[[Sequelize.literal('totalExpense'),'DESC']],
            raw:true
        });
        res.json(leaderboard);
        
    } catch (error) {
         console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
        
    }
}
module.exports={
    leaderBoard
}