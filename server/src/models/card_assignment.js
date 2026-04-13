import sequelize from "../config/connectdb.js";
import { DataTypes } from "sequelize";

const CardAssignment=sequelize.define('CardAssignment',{
    assigned_at:DataTypes.DATE
})

export default CardAssignment