import { User } from "../models/index.js";
import bcrypt from "bcrypt"
import validator from "validator"
import jwt from "jsonwebtoken"


export const changePassword = async (req, res) => {
    const id = req.user.id;
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findOne({ where: { id } })
        const isMatch = await bcrypt.compare(currentPassword, user.hashedPassword)
        if (isMatch) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(newPassword, salt)
            const updatePassword = await User.update(
                { hashedPassword },
                {where:{id}}
            );
            res.status(200).json({message:"Password Changes"});
            
        }else{
            res.status(400).json({message:"Wrong Password"})
        }
    } catch (error) {
        res.status(500).json({message:"Something went wrong"})
    }
}
export const changeEmail = async (req, res) => {
    const id = req.user.id;
    const { currentPassword,newEmail} = req.body;

    try {
        const user = await User.findOne({ where: { id } })
        const isMatch = await bcrypt.compare(currentPassword, user.hashedPassword)
        if (isMatch) {
            if(!validator.isEmail(newEmail)) return res.status(404).json({message:"invalid Email"})
            const updateEmail = await User.update(
                { email : newEmail },
                {where:{id}}
            );
            const updatedUser = await User.findOne({ where:{id}});
            const token = jwt.sign({id:id,email:updatedUser.email,name:updatedUser.name},process.env.JWT_SECRET,{expiresIn:'7d'})
            res.status(200).json({token});
            
        }else{
            res.status(400).json({message:"Wrong Password"})
        }
    } catch (error) {
        res.status(500).json({message:"Something went wrong"})
    }
}
export const changeUsername = async (req, res) => {
    const id = req.user.id;
    const { currentPassword, newUsername } = req.body;

    try {
        const user = await User.findOne({ where: { id } })
        const isMatch = await bcrypt.compare(currentPassword, user.hashedPassword)
        if (isMatch) {
            const updateUsername = await User.update(
                { name: newUsername },
                {where:{id}}
            );
            const updatedUser = await User.findOne({ where:{id}});
            const token = jwt.sign({id:id,email:updatedUser.email,name:updatedUser.name},process.env.JWT_SECRET,{expiresIn:'7d'})
            res.status(200).json({token});
            
        }else{
            res.status(400).json({message:"Wrong Password"})
        }
    } catch (error) {
        res.status(500).json({message:"Something went wrong"})
    }
}