import sequelize from "../config/connectdb.js";
import { DataTypes } from "sequelize";

const Board=sequelize.define('Board',{
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    visibility: {
        type:DataTypes.ENUM('public','private','personal'),
        defaultValue:'public',
        allowNull:false,
    },
    favorite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
})

export default Board