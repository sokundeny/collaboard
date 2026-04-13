import { CardAssignment } from "../models/index.js";

export const assignCard=async(req,res)=>{
    try {
        const card_id=req.params.id
        const {user_id}=req.body

        await CardAssignment.create({
            assigned_at:Date.now(),
            user_id,
            card_id
        })

        res.status(201).json({message:"card is assigned"})
    } catch (error) {
        res.status(500).json({message:"something went wrong"})
    }
}

export const removeAssignment=async(req,res)=>{
    try {
        const card_id=req.params.id
        const {user_id}=req.body

        const assigment=await CardAssignment.findOne({
            where:{
                user_id,
                card_id
            }
        })

        if(!assigment){
            return res.status(404).json({message:"Assignment not found"})
        }

        assigment.destroy()

        res.status(200).json({message:"Assigment has been deleted"})

    } catch (error) {
        res.status(500).json({message:"something went wrong"})
    }
}