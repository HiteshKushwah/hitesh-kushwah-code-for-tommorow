//here we import the sequalize

import { DataTypes, Sequelize } from "sequelize";
import {sequalize} from "../config/db.js";

//now here we define  our user what user have 

const User = sequalize.define('User', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    
    lastName: {
        type:DataTypes.STRING,
        allowNull: false
        
    },

    email: {
        type:DataTypes.STRING,
        allowNull: false,
        unique: true ,

    },
   
  password: {
    type:DataTypes.STRING,
    allowNull: false,

  },

  resetToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  resetTokenExpiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },


  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('NOW'),

  }, 
  timestamps: false,
});
export default User;