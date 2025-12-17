import express from "express"
import { addContact,getContact,editContact,getSingleContact,deleteContact } from "../controllers/contactController.js"

const router = express.Router()

router.post("/",addContact)
router.get("/",getContact)
router.put("/:id",editContact)
router.get("/:id", getSingleContact);
router.delete("/:id",deleteContact)

export default router