import mongoose, { Schema, Document, Types } from "mongoose";


export interface Ishop extends Document {
  websiteId: string;
  userId: Types.ObjectId;
  ShopName: string;
  logo: string;
  description: string;
  shopNumber: string;
  Status: "active" | "banned";
  category: string[];

}



const shopSchema = new Schema<Ishop>(
  {
    websiteId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    ShopName: {
      type: String,
      required: true,
    },

    logo: {
      type: String,
    },

    description: {
      type: String,
    },

    shopNumber: {
      type: String,
      required: true,
    },

    Status: {
      type: String,
      enum: ["active", "banned"],
      default: "active",
    },

   

    category: {
      type: [String],
      default: [],
    },



  },
  {
    timestamps: true,
  }
);



export const shopModel = mongoose.model<Ishop>("shop", shopSchema);