import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            trim: true,
        },
        countryCode: {
            type: String,
            required: true,
            trim: true,
        },
        number: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

contactSchema.index(
    { countryCode: 1, number: 1 },
    { unique: true }
);

export default mongoose.model("Contact", contactSchema);
