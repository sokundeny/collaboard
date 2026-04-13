import express from "express"
import { authentication } from "../middleware/authentication.js"
import { createList, deleteList, updateList } from "../controllers/list.controller.js"
import { getCardsByListId } from "../controllers/card.controller.js"

const listRouter=express.Router()

listRouter.get("/:id/card", authentication, getCardsByListId)

listRouter.post("/", authentication, createList);

listRouter.put("/:id", authentication, updateList) // 

listRouter.delete("/:id", authentication, deleteList)

export default listRouter
