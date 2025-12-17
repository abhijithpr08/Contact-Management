import Contact from "../models/Contact.js"

export const addContact = async (req,res)=>{
    try{
        const {userName,countryCode,number} = req.body
        const newContact = await Contact.create({
            userName,
            countryCode,
            number
        })
        res.status(201).json()
    }
    catch(error){
        res.status(500).json(error.message)
    }
}

export const getContact = async (req,res)=>{
    try{
        const contacts = await Contact.find()
        res.status(201).json(contacts)
    }
    catch(error){
        res.status(500).json(error.message)
    }
}

export const editContact =async ()=>{

}

export const deleteContact = async (req,res)=>{
    await Contact.findByIdAndDelete(req.params.id)
    res.json({ message: "Delete contact" })
}