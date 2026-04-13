import sequelize from "../config/connectdb.js";
import { DataTypes } from "sequelize";

const BoardMember=sequelize.define('BoardMember',{
    role:DataTypes.STRING,
    joint_at:DataTypes.DATE,
})

export default BoardMember