const db=require('../utils/db-connection');
const Expense=require('../models/expenseModels');
const User = require('../models/userModels');

const addExpense = async(req,res)=>{
    const transaction = await db.transaction();
    try{
        const {expenseAmount,description,category}=req.body;

        const  expense = await Expense.create({
            expenseAmount:expenseAmount,
            description:description,
            category:category,
             userId: req.user.userId 
        },
        {transaction}
    );

        await User.increment(
            {totalExpense:expenseAmount},
            {
                where:{
                    id:req.user.userId
                },
                transaction
            }
        );
        await transaction.commit();
         res.status(201).json(expense);
    }catch(error){
         await transaction.rollback();
        console.log(error);
        res.status(500).send("error while adding expense");
       

    }

}

// const getExpense=async(req,res)=>{
   
//     try {
//          const expenses=await Expense.findAll(
//             {
//     where: {
//         userId: req.user.userId
//     }
// }
//          );

//     res.status(200).json(expenses);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('error while fetching expenses');
        
//     }

// }

const getExpense = async (req, res) => {

    try {

        const page = Number(req.query.page) || 1;
        const ITEMS_PER_PAGE = 2;

        const { count, rows } = await Expense.findAndCountAll({

            where: {
                userId: req.user.userId
            },

            limit: ITEMS_PER_PAGE,

            offset: (page - 1) * ITEMS_PER_PAGE,

            order: [["createdAt", "DESC"]]

        });

        res.status(200).json({

            expenses: rows,

            currentPage: page,

            hasNextPage: ITEMS_PER_PAGE * page < count,

            hasPreviousPage: page > 1,

            lastPage: Math.ceil(count / ITEMS_PER_PAGE)

        });

    } catch (error) {

        console.log(error);

        res.status(500).send("Error while fetching expenses");

    }

};
const deletExpense = async (req, res) => {
    const transaction= await db.transaction();
    try {

        const expenseId = req.params.id;

        // Fetch the expense first
        const expense = await Expense.findOne({
            where: {
                id: expenseId,
                userId: req.user.userId
            },
            transaction
        });

        if (!expense) {
              await transaction.rollback();
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
                },
                transaction
            }
        );

        // Delete expense
        
        await expense.destroy({transaction});
         await transaction.commit();
        res.status(200).json({
            message: "Expense deleted successfully"
        });

    } catch (error) {
        await transaction.rollback();
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