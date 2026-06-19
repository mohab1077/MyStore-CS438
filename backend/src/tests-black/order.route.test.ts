import request from "supertest";
import mongoose from "mongoose";
import { orderModel } from "../modules/order";
import app from "./app";

describe("Feature 13: View Paid Orders", () => {
    let trader1Token: string;
    let trader2Token: string;
    let trader1ShopId: string;

    beforeAll(async () => {
        await mongoose.connect(process.env.DATABASE_URL || "");

        const trader1Email = `trader1_${Date.now()}@test.com`;
        const trader2Email = `trader2_${Date.now()}@test.com`;

        await request(app).post("/user/signup").send({
            name: "Trader One",
            email: trader1Email,
            phone: "0911234567",
            password: "Aa123456!",
        });

        await request(app).post("/user/signup").send({
            name: "Trader Two",
            email: trader2Email,
            phone: "0921234567",
            password: "Aa123456!",
        });

        const login1 = await request(app).post("/user/login").send({
            email: trader1Email,
            password: "Aa123456!",
        });

        const login2 = await request(app).post("/user/login").send({
            email: trader2Email,
            password: "Aa123456!",
        });

        trader1Token = login1.body.msg;
        trader2Token = login2.body.msg;

        await request(app)
            .post("/shop/CreateShop")
            .set("Authorization", `Bearer ${trader1Token}`)
            .send({
                websiteId: `shop-${Date.now()}`,
                ShopName: "Test Shop",
                shopNumber: "0911234567",
            });

        const myShopsRes = await request(app)
            .get("/shop/myshops")
            .set("Authorization", `Bearer ${trader1Token}`);

        trader1ShopId = myShopsRes.body[0]._id;

        await orderModel.create({
            orderNumber: Math.floor(Math.random() * 1000000),
            storeId: trader1ShopId,
            customerEmail: trader1Email,
            products: [
                {
                    productId: new mongoose.Types.ObjectId(),
                    quantity: 2,
                    ProductName: "iPhone",
                },
            ],
            totalAmount: 250,
            paymentStatus: "paid",
            orderStatus: "Processing",
            shippingAddress: "Tripoli",
            orderDate: new Date(),
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it("VC1: should return paid orders with valid token and owner shop", async () => {
        const res = await request(app)
            .get(`/order/orders?id=${trader1ShopId}&page=1`)
            .set("Authorization", `Bearer ${trader1Token}`);

        expect(res.status).toBe(200);
    });

    it("IC1: should reject request without token", async () => {
        const res = await request(app)
            .get(`/order/orders?id=${trader1ShopId}&page=1`);

        expect(res.status).toBe(401);
    });

    it("IC2: should reject request with wrong token", async () => {
        const res = await request(app)
            .get(`/order/orders?id=${trader1ShopId}&page=1`)
            .set("Authorization", "Bearer wrong-token");

        expect(res.status).toBe(500);
    });

    it("IC3: should reject trader who does not own the shop", async () => {
        const res = await request(app)
            .get(`/order/orders?id=${trader1ShopId}&page=1`)
            .set("Authorization", `Bearer ${trader2Token}`);

        expect(res.status).toBe(403);
    });

    it("IC4: should reject negative page number", async () => {
        const res = await request(app)
            .get(`/order/orders?id=${trader1ShopId}&page=-1`)
            .set("Authorization", `Bearer ${trader1Token}`);

        expect(res.status).toBeGreaterThanOrEqual(400);
    });

    it("IC5: should reject non-numeric page value", async () => {
        const res = await request(app)
            .get(`/order/orders?id=${trader1ShopId}&page=abc`)
            .set("Authorization", `Bearer ${trader1Token}`);

        expect(res.status).toBeGreaterThanOrEqual(400);
    });

    it("BVA1: page 0 should be invalid", async () => {
        const res = await request(app)
            .get(`/order/orders?id=${trader1ShopId}&page=0`)
            .set("Authorization", `Bearer ${trader1Token}`);

        expect(res.status).toBe(400);
    });

    it("BVA2: page 1 should be valid", async () => {
        const res = await request(app)
            .get(`/order/orders?id=${trader1ShopId}&page=1`)
            .set("Authorization", `Bearer ${trader1Token}`);

        expect(res.status).toBe(200);
    });

    it("BVA3: page 2 should be valid", async () => {
        const res = await request(app)
            .get(`/order/orders?id=${trader1ShopId}&page=2`)
            .set("Authorization", `Bearer ${trader1Token}`);

        expect(res.status).toBe(200);
    });
});