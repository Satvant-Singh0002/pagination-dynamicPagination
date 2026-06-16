const {Sequelize}=require('sequelize');

const sequelize = new Sequelize('expense-tracker','root','sat2002',{
    host:'localhost',
    dialect:'mysql'
});

(async()=>{
    try {
        await sequelize.authenticate();
        console.log("established database connection successfully");
        
    } catch (error) {
        console.log(error);
        console.log('Unable to establish connection with database');
        
    }
})();
module.exports=sequelize;