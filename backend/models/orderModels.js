const {Sequelize,DataTypes}=require('sequelize');
const db = require('../utils/db-connection');

const Order = db.define('order',{
    orderId:{
        type:DataTypes.STRING
    },
   
    status:{
        type:DataTypes.STRING
    }
})
module.exports=Order;