import { User,Board ,List} from "../models/index.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

export const registerUser=async(req,res)=>{
    try {
        const {name,email,password}=req.body

        if(!name||!email||!password){
            return res.status(400).json({message:"something missing"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({message:"email using wrong format"})
        }
        if(password.length<8){
            return res.status(400).json({message:"password to short"})
        }
        const exist=await User.findOne({where:{email}})
        if(exist){
            return res.status(409).json({message:"email already use"})
        }
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        const newUser=await User.create({
            name,
            email,
            hashedPassword
        })

        const personalBoard = await Board.create({
            title:"Personal",
            visibility:"personal",
            user_id :newUser.id
        })

        await List.create({
            title:"Important",
            position:1,
            board_id:personalBoard.id
        })

        await List.create({
            title:"Plan",
            position:2,
            board_id:personalBoard.id
        })
        
        const token=jwt.sign({id:newUser.id,email,name},process.env.JWT_SECRET,{expiresIn:'7d'})
        return res.status(201).json({token})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"something went wrong"})
    }
}

export const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body
        if(!email||!password){
            return res.status(400).json({message:"something missing"})
        }
        const exist=await User.findOne({where:{email}})
        if(!exist){
            return res.status(404).json({message:"email not found"})
        }
        const isMatch=await bcrypt.compare(password,exist.hashedPassword)
        if(!isMatch){
            return res.status(400).json({message:"wrong password"})
        }
        const token=jwt.sign({id:exist.id,email,name:exist.name},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.status(202).json({token})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"something went wrong"})
    }
}
