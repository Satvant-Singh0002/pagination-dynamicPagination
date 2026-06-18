
const Expense=require('./expenseModels');
const User=require('./userModels');

//one to many Association
User.hasMany(Expense);
Expense.belongsTo(User);

module.exports={
    Expense,
    User
}