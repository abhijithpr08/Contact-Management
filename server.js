import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import router from "./routes/contactRoute.js";

dotenv.config()
connectDB()
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use("/api/contacts",router)
app.use(express.static("public"))

const PORT = process.env.PORT || 4000

app.listen(PORT, ()=>{
    console.log(`server running on http://localhost:${PORT}`)
})