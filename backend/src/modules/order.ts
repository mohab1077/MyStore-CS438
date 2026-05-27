import mongoose, { Schema, Document, Types } from "mongoose";

interface IOrderItem {
  ProductName: string;
  quantity: number;
  
}
export interface IOrder extends Document {
  orderNumber: number; // auto inc
  storeId: Types.ObjectId;
  customerId: Types.ObjectId;
  products: IOrderItem[];
  totalAmount: number;
  paymentStatus: "pending" | "paid";
  orderStatus: "processing" | "shipped" | "delivered" | "Pending" | "Cancelled";
  shippingAddress: string;
  orderDate: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    ProductName: {
      type: String,
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: Number, unique: true, index: true },

    storeId: {
      type: Schema.Types.ObjectId,
      ref: "shop",
      required: true,
      index: true,
    },

    customerId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },

    products: { type: [orderItemSchema], required: true, default: [] },

    totalAmount: { type: Number, required: true, min: 0 },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
      required: true,
      index: true,
    },

    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered","Pending","Cancelled"],
      default: "Pending",
      required: true,
    },

    shippingAddress: { type: String, required: true },

    orderDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);



export const orderModel = mongoose.model<IOrder>("orders", orderSchema);