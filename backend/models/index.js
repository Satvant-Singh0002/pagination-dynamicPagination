
const Expense=require('./expenseModels');
const User=require('./userModels');
const Order = require('./orderModels');
const ForgotPasswordRequest = require('./forgotPasswordRequestModels');

//one to many Association
User.hasMany(Expense);
Expense.belongsTo(User);
// User and Order association
User.hasMany(Order);
Order.belongsTo(User);
// many to one association 
User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);

module.exports={
    Expense,
    User,
    Order,
    ForgotPasswordRequest
}