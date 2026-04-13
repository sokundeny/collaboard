import sequelize from "../config/connectdb.js";
import { DataTypes } from "sequelize";

const ActivityLog=sequelize.define('ActivityLog',{
    action:DataTypes.STRING,
})

export default ActivityLog