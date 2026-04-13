import express from "express";
import { authentication } from "../middleware/authentication.js";
import { changeEmail, changePassword, changeUsername } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.patch('/password',authentication,changePassword);
userRouter.patch('/email',authentication,changeEmail);
userRouter.patch('/username',authentication,changeUsername);



export default userRouter;