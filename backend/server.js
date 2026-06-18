const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.join(__dirname, '.env')
});
console.log("JWT_SECRET =", process.env.JWT_SECRET);

const db=require('./utils/db-connection');
const expenseRoutes=require('./Routes/expenseRoutes');
const userRoutes=require('./Routes/userRoutes');
const loginRoutes=require('./Routes/loginRoutes')

//const expenseModels=require('./models/expenseModels');
//const userModels=require('./models/userModels');
require('./models');
app.use(express.json());
const cors=require('cors');
app.use(cors());


app.use('/expense',expenseRoutes);
app.use('/expenseUser',userRoutes);
app.use('/login',loginRoutes);
db.sync({alter:true}).then(()=>{
    
const port = 4000;
app.listen(port,()=>{
    console.log(`sever is runing on port ${port}`);
})
})
