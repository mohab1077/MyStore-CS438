import mongoose, { Schema, Document, Types } from "mongoose";

interface IAttribute {
  name: string;     // مثلا: Color
  value: string;    // مثلا: Red
}

export interface IProduct extends Document {
  storeId: Types.ObjectId;
  name: string;
  price: number;
  description: string;
  imgs: string[];
  attributes: IAttribute[];
  stock: number;
  category: string;
  status: "active" | "hidden";
}

const attributeSchema = new Schema<IAttribute>(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "shop",
      required: true,
      index: true, 
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
    },

    imgs: {
      type: [String],
      default: [],
    },

    attributes: {
      type: [attributeSchema],
      default: [],
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    category: {
      type: String,
      index: true, 
    },

    status: {
      type: String,
      enum: ["active", "hidden"],
      default: "active",
    },
  },
  { timestamps: true }
);




export const productModel = mongoose.model<IProduct>(
  "products",
  productSchema
);