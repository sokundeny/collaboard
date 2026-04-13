import sequelize from "../config/connectdb.js";
import { DataTypes } from "sequelize";

const Card=sequelize.define('Card',{
    title:DataTypes.STRING,
    description:DataTypes.TEXT,
    status:{
        type:DataTypes.ENUM('to-do','done','missed'),
        defaultValue:'to-do',
        allowNull:false
    },
    start_at:DataTypes.DATE,
    due_at:DataTypes.DATE,
    position:DataTypes.INTEGER,
})

export default Card