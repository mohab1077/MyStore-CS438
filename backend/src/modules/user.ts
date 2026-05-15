import mongoose, { Schema, Document } from "mongoose";

export interface Iuser extends Document {
    type: "admin" | "trader";
    name: string;
    email: string;
    password: string;
    phone: string;
}



const userSchema = new Schema<Iuser>({
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ["admin", "trader"],
        required: true,
    },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },


})


export const usermodel = mongoose.model<Iuser>("user", userSchema)