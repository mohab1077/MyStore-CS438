import mongoose, { Schema, Document } from "mongoose";

export interface ICode extends Document {
  code: string;
  email: string;
  expiresAt: Date;       
  createdAt?: Date;
  updatedAt?: Date;
}

const codeSchema = new Schema<ICode>(
  {
    code: { type: String, required: true }, 
    email: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);


codeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const codeModel = mongoose.model<ICode>("codes", codeSchema);