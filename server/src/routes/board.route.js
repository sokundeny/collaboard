import express from "express"
import { addBoard, deleteBoard, getBoard, getBoardById, getPersonalBoard, inviteUser, updateBoard } from "../controllers/board.controller.js"
import { authentication } from "../middleware/authentication.js"
import { getList } from "../controllers/list.controller.js"


const boardRouter = express.Router()

boardRouter.get("/", authentication, getBoard)
boardRouter.get("/:id", authentication, getBoardById)
boardRouter.get('/user/personal', authentication, getPersonalBoard)
boardRouter.post("/", authentication, addBoard)
boardRouter.put('/:id', authentication, updateBoard)
boardRouter.delete('/:id', authentication, deleteBoard)

boardRouter.get("/:id/list", authentication, getList)
//Invite user to board
boardRouter.post('/:boardId/invite', authentication, inviteUser)
export default boardRouter;