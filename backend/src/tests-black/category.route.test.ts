// tests/category.route.test.ts

import request from "supertest";
import mongoose from "mongoose";
import app from "./app";

describe("Feature 9: Add and Edit Store Categories", () => {
  let trader1Token: string;
  let trader2Token: string;
  let trader1ShopId: string;

  const password = "Aa123456!";

  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL || "");

    const time = Date.now();

    const trader1 = {
      name: "Trader One",
      email: `trader1_${time}@test.com`,
      phone: "0911234567",
      password,
    };

    const trader2 = {
      name: "Trader Two",
      email: `trader2_${time}@test.com`,
      phone: "0921234567",
      password,
    };

    await request(app).post("/user/signup").send(trader1);
    await request(app).post("/user/signup").send(trader2);

    const login1 = await request(app).post("/user/login").send({
      email: trader1.email,
      password,
    });

    const login2 = await request(app).post("/user/login").send({
      email: trader2.email,
      password,
    });

    trader1Token = login1.body.msg;
    trader2Token = login2.body.msg;

    await request(app)
      .post("/shop/CreateShop")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        websiteId: `category-shop-${time}`,
        ShopName: "Category Test Shop",
        shopNumber: "0911234567",
      });

    const myShopsRes = await request(app)
      .get("/shop/myshops")
      .set("Authorization", `Bearer ${trader1Token}`);

    trader1ShopId = myShopsRes.body[0]._id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // =========================
  // Valid Class
  // =========================

  it("VC1: should update categories successfully with valid token, owner success, and valid categories data", async () => {
    const res = await request(app)
      .put("/shop/category")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        categorys: ["Phones", "Laptops"],
      });

    expect(res.status).toBe(200);
  });

  // =========================
  // Invalid Token Cases
  // =========================

  it("IC1: should return authentication error when no token, owner success, and valid categories data", async () => {
    const res = await request(app)
      .put("/shop/category")
      .send({
        id: trader1ShopId,
        categorys: ["Phones", "Laptops"],
      });

    expect(res.status).toBe(401);
  });

  it("IC3: should return authentication error when no token, owner failed, and valid categories data", async () => {
    const fakeShopId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .put("/shop/category")
      .send({
        id: fakeShopId,
        categorys: ["Phones", "Laptops"],
      });

    expect(res.status).toBe(401);
  });

  it("IC4: should return authentication error when no token, owner failed, and invalid categories data", async () => {
    const fakeShopId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .put("/shop/category")
      .send({
        id: fakeShopId,
        categorys: ["AB"],
      });

    expect(res.status).toBe(401);
  });

  // =========================
  // Invalid Ownership Cases
  // =========================

  it("IC6: should return authorization error when valid token, owner failed, and valid categories data", async () => {
    const res = await request(app)
      .put("/shop/category")
      .set("Authorization", `Bearer ${trader2Token}`)
      .send({
        id: trader1ShopId,
        categorys: ["Phones", "Laptops"],
      });

    expect(res.status).toBe(403);
  });

  it("IC7: should return authorization error when valid token, owner failed, and invalid categories data", async () => {
    const res = await request(app)
      .put("/shop/category")
      .set("Authorization", `Bearer ${trader2Token}`)
      .send({
        id: trader1ShopId,
        categorys: ["AB"],
      });

    expect(res.status).toBe(403);
  });

  // =========================
  // Invalid Number of Categories Cases
  // =========================

  it("IC8: should return validation error when valid token, owner success, and more than 50 categories", async () => {
    const res = await request(app)
      .put("/shop/category")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        categorys: Array.from(
          { length: 51 },
          (_, i) => `Category${i}`
        ),
      });

    expect(res.status).toBe(400);
  });

  // =========================
  // Invalid Category Name Cases
  // =========================

  it("IC9: should return validation error when category name is less than 3 characters", async () => {
    const res = await request(app)
      .put("/shop/category")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        categorys: ["AB"],
      });

    expect(res.status).toBe(400);
  });

  it("IC10: should return validation error when category name is more than 30 characters", async () => {
    const res = await request(app)
      .put("/shop/category")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        categorys: ["A".repeat(31)],
      });

    expect(res.status).toBe(400);
  });

  it("IC12: should return validation error when category name contains spaces only", async () => {
    const res = await request(app)
      .put("/shop/category")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        categorys: ["     "],
      });

    expect(res.status).toBe(400);
  });

  // =========================
  // BVA: Number of Categories 0–50
  // =========================

  it("BVA1: should accept 0 categories", async () => {
    const res = await request(app)
      .put("/shop/category")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        categorys: [],
      });

    expect(res.status).toBe(200);
  });

  it("BVA2: should accept 1 category", async () => {
    const res = await request(app)
      .put("/shop/category")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        categorys: ["Cat"],
      });

    expect(res.status).toBe(200);
  });

  it("BVA3: should accept 2 categories", async () => {
    const res = await request(app)
      .put("/shop/category")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        categorys: ["Cat", "Dog"],
      });

    expect(res.status).toBe(200);
  });

  it("BVA4: should accept 49 categories", async () => {
    const res = await request(app)
      .put("/shop/category")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        categorys: Array.from(
          { length: 49 },
          (_, i) => `Category${i}`
        ),
      });

    expect(res.status).toBe(200);
  });

  it("BVA5: should accept 50 categories", async () => {
    const res = await request(app)
      .put("/shop/category")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        categorys: Array.from(
          { length: 50 },
          (_, i) => `Category${i}`
        ),
      });

    expect(res.status).toBe(200);
  });

  it("BVA6: should reject 51 categories", async () => {
    const res = await request(app)
      .put("/shop/category")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        categorys: Array.from(
          { length: 51 },
          (_, i) => `Category${i}`
        ),
      });

    expect(res.status).toBe(400);
  });

  // =========================
  // BVA: Category Name Length 3–30
  // =========================

  it("BVA7: should reject category name length 2", async () => {
    const res = await request(app)
      .put("/shop/category")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        categorys: ["AB"],
      });

    expect(res.status).toBe(400);
  });

  it("BVA8: should accept category name length 3", async () => {
    const res = await request(app)
      .put("/shop/category")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        categorys: ["ABC"],
      });

    expect(res.status).toBe(200);
  });

  it("BVA9: should accept category name length 4", async () => {
    const res = await request(app)
      .put("/shop/category")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        categorys: ["ABCD"],
      });

    expect(res.status).toBe(200);
  });

  it("BVA10: should accept category name length 29", async () => {
    const res = await request(app)
      .put("/shop/category")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        categorys: ["A".repeat(29)],
      });

    expect(res.status).toBe(200);
  });

  it("BVA11: should accept category name length 30", async () => {
    const res = await request(app)
      .put("/shop/category")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        categorys: ["A".repeat(30)],
      });

    expect(res.status).toBe(200);
  });

  it("BVA12: should reject category name length 31", async () => {
    const res = await request(app)
      .put("/shop/category")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        categorys: ["A".repeat(31)],
      });

    expect(res.status).toBe(400);
  });
});