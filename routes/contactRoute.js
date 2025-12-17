import express from "express"
import { addContact,getContact,editContact,deleteContact } from "../controllers/contactController.js"

const router = express.Router()

router.post("/",addContact)
router.get("/",getContact)
router.put("/",editContact)
router.delete("/",deleteContact)

export default router