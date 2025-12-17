import mongoose from "mongoose"

const contactSchema = new mongoose.Schema({
    userName:String,
    countryCode:String,
    number:Number
}) 

const Contact = mongoose.model("Contact",contactSchema)

export default Contact