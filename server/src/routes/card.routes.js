import express from "express"
import { createCard,updateCard,deleteCard } from "../controllers/card.controller.js"
import { authentication } from "../middleware/authentication.js"
import { assignCard,removeAssignment } from "../controllers/assign.controller.js"

const cardRouter=express.Router()

cardRouter.post("/", authentication, createCard)

cardRouter.put("/:id", authentication, updateCard)

cardRouter.delete("/:id", authentication, deleteCard)

// assign card

cardRouter.post('/assign/:id', authentication, assignCard)

cardRouter.delete('/remove/:id', authentication, removeAssignment)

export default cardRouter