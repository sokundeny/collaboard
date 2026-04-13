import { User, UserProfile } from "../models/index.js";


const uploadProfile = async (req,res) =>{
    const user_id = req.user.id;
    const {public_id,secure_url}= req.body;
    try {
        const result = await UserProfile.create({
           user_id,
           public_id,
           secure_url
        })
        res.json({message:"Sucessfully uplaod profile"});
    } catch (error) {
        res.json({message:error.message});
    }
}

const updateProfile = async(req,res) =>{
    const user_id = req.user.id;
    const {public_id,secure_url}= req.body;
    try {
        const result = await UserProfile.update({
            public_id,
            secure_url
        },
            {where:{user_id}}
        )
        res.json({message:"Sucessfully update profile"});
    } catch (error) {
        res.json({message:error.message});
    }
}

const getUserProfile = async (req,res) => {

    const {id,name,email} = req.user;
    try {
        const profile = await UserProfile.findOne({where:{user_id:id},
        attributes:["public_id","secure_url"]
        });
        const userProfile ={
            name: name,
            email: email,
            ...(profile? profile.toJSON():null)
        }
        res.json(userProfile);
    } catch (error) {
        res.json({message:error.message});
    }
}

export {
    uploadProfile,
    updateProfile,
    getUserProfile
}
