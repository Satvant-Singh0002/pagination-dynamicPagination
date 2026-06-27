const {Sequelize,DataTypes}=require('sequelize');
const db=require('../utils/db-connection');

const User=db.define('user',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false

    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
     isPremiumUser: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
},
})
module.exports=User;