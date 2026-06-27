
const Expense=require('./expenseModels');
const User=require('./userModels');
const Order = require('./orderModels');

//one to many Association
User.hasMany(Expense);
Expense.belongsTo(User);
// User and Order association
User.hasMany(Order);
Order.belongsTo(User);

module.exports={
    Expense,
    User,
    Order
}