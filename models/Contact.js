import mongoose from "mongoose"

const contactSchema = new mongoose.Schema({
    userNmae:String,
    number:Number,
    countryCode:String
}) 

const contact = mongoose.model("Contact",contactSchema)

export default contact