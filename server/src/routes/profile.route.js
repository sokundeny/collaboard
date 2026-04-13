import express from "express";
import { getUserProfile, updateProfile, uploadProfile } from "../controllers/profile.controller.js";
import { authentication } from "../middleware/authentication.js";


const ProfileRoute = express.Router();

ProfileRoute.get('/',authentication, getUserProfile)
ProfileRoute.post('/upload',authentication,uploadProfile);
ProfileRoute.post('/update',authentication,updateProfile);

export default ProfileRoute;