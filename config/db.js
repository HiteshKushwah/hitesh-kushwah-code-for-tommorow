import { Sequelize } from "sequelize";
//here we used the dotenv file
import dotenv from 'dotenv'

//dotenv
dotenv.config();

const sequalize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        //here this is importnt we can disabled the logging
        logging: false,

    }
);

//hewe we conncet with the db
const connectDB = async () => {
    try{
       await sequalize.authenticate();
       console.log('mysql connected successfully');
       await sequalize.sync({force: false});

    } catch (error) {
        console.error('mysql connection failed:' , error.message);

    } 

};
export {sequalize, connectDB};