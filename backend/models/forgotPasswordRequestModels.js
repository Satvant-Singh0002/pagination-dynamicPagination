const {Sequelize, DataTypes}=require('sequelize');

const sequelize = require('../utils/db-connection');

const ForgotPasswordRequest =sequelize.define('forgotPasswordRequest',{
    id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
},
userId: DataTypes.INTEGER,
active: DataTypes.BOOLEAN,
expiresby: DataTypes.DATE

})
module.exports=ForgotPasswordRequest;