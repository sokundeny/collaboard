import sequelize from "../config/connectdb.js";
import { DataTypes } from "sequelize";

const List=sequelize.define('List',{
    title: DataTypes.STRING,
    position: DataTypes.INTEGER,
})

export default List