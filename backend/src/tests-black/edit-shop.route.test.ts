// tests/edit-shop.route.test.ts

import request from "supertest";
import mongoose from "mongoose";
import app from "./app";


describe("Feature 7: Edit Shop Information", () => {
  let trader1Token: string;
  let trader2Token: string;
  let trader1ShopId: string;

  const password = "Aa123456!";

  const validShopData = {
    ShopName: "My Shop",
    logo: "http://localhost:5001/uploads/logo.png",
    description: "Good shop description",
    shopNumber: "0911234567",
  };

  beforeAll(async () => {
    

    const time = Date.now();

    const trader1 = {
      name: "Trader One",
      email: `editshop_trader1_${time}@test.com`,
      phone: "0911234567",
      password,
    };

    const trader2 = {
      name: "Trader Two",
      email: `editshop_trader2_${time}@test.com`,
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
        websiteId: `edit-shop-${time}`,
        ShopName: "Original Shop",
        shopNumber: "0911234567",
      });

    const myShopsRes = await request(app)
      .get("/shop/myshops")
      .set("Authorization", `Bearer ${trader1Token}`);

    trader1ShopId = myShopsRes.body[0]._id;
  });

  afterAll(async () => {
     await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("VC1: should update shop with valid token, owner success, and valid input data", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
      });

    expect(res.status).toBe(200);
  });

  it("IC1: should reject no token, owner success, and valid input data", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .send({
        id: trader1ShopId,
        ...validShopData,
      });

    expect(res.status).toBe(401);
  });

  it("IC3: should reject no token, owner failed, and valid input data", async () => {
    const fakeShopId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .put("/shop/edit")
      .send({
        id: fakeShopId,
        ...validShopData,
      });

    expect(res.status).toBe(401);
  });

  it("IC4: should reject no token, owner failed, and invalid input data", async () => {
    const fakeShopId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .put("/shop/edit")
      .send({
        id: fakeShopId,
        ShopName: "A",
        logo: "not-image-url",
        description: "A".repeat(501),
        shopNumber: "0951234567",
      });

    expect(res.status).toBe(401);
  });

  it("IC6: should reject valid token, owner failed, and valid input data", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader2Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
      });

    expect(res.status).toBe(403);
  });

  it("IC7: should reject valid token, owner failed, and invalid input data", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader2Token}`)
      .send({
        id: trader1ShopId,
        ShopName: "A",
        logo: "not-image-url",
        description: "A".repeat(501),
        shopNumber: "0951234567",
      });

    expect(res.status).toBe(403);
  });

  it("IC8: should reject ShopName less than 2 characters", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        ShopName: "A",
      });

    expect(res.status).toBe(400);
  });

  it("IC9: should reject ShopName more than 80 characters", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        ShopName: "A".repeat(81),
      });

    expect(res.status).toBe(400);
  });

  it("IC10: should reject ShopName containing spaces only", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        ShopName: "     ",
      });

    expect(res.status).toBe(400);
  });

  it("IC11: should reject logo that is not a valid image URL", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        logo: "not-image-url",
      });

    expect(res.status).toBe(400);
  });

  it("IC14: should reject Description more than 500 characters", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        description: "A".repeat(501),
      });

    expect(res.status).toBe(400);
  });

  it("IC15: should reject ShopNumber starts with 095", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        shopNumber: "0951234567",
      });

    expect(res.status).toBe(400);
  });

  it("IC16: should reject ShopNumber starts with 090", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        shopNumber: "0901231234",
      });

    expect(res.status).toBe(400);
  });

  it("IC17: should reject ShopNumber less than 10 digits", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        shopNumber: "091123456",
      });

    expect(res.status).toBe(400);
  });

  it("IC18: should reject ShopNumber more than 10 digits", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        shopNumber: "09112345678",
      });

    expect(res.status).toBe(400);
  });

  it("IC19: should reject ShopNumber that is not a number", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        shopNumber: "091abcdefg",
      });

    expect(res.status).toBe(400);
  });

  it("BVA1: should reject ShopName length 1", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        ShopName: "A",
      });

    expect(res.status).toBe(400);
  });

  it("BVA2: should accept ShopName length 2", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        ShopName: "AB",
      });

    expect(res.status).toBe(200);
  });

  it("BVA3: should accept ShopName length 3", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        ShopName: "ABC",
      });

    expect(res.status).toBe(200);
  });

  it("BVA4: should accept ShopName length 79", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        ShopName: "A".repeat(79),
      });

    expect(res.status).toBe(200);
  });

  it("BVA5: should accept ShopName length 80", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        ShopName: "A".repeat(80),
      });

    expect(res.status).toBe(200);
  });

  it("BVA6: should reject ShopName length 81", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        ShopName: "A".repeat(81),
      });

    expect(res.status).toBe(400);
  });

  it("BVA7: should accept Description length 499", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        description: "A".repeat(499),
      });

    expect(res.status).toBe(200);
  });

  it("BVA8: should accept Description length 500", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        description: "A".repeat(500),
      });

    expect(res.status).toBe(200);
  });

  it("BVA9: should reject Description length 501", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        description: "A".repeat(501),
      });

    expect(res.status).toBe(400);
  });

  it("BVA10: should reject ShopNumber with 9 digits", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        shopNumber: "091123456",
      });

    expect(res.status).toBe(400);
  });

  it("BVA11: should accept ShopNumber with 10 digits", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        shopNumber: "0911234567",
      });

    expect(res.status).toBe(200);
  });

  it("BVA12: should reject ShopNumber with 11 digits", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        shopNumber: "09112345678",
      });

    expect(res.status).toBe(400);
  });

  it("BVA13: should accept ShopNumber prefix 091", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        shopNumber: "0911234567",
      });

    expect(res.status).toBe(200);
  });

  it("BVA14: should accept ShopNumber prefix 092", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        shopNumber: "0921234567",
      });

    expect(res.status).toBe(200);
  });

  it("BVA15: should accept ShopNumber prefix 093", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        shopNumber: "0931234567",
      });

    expect(res.status).toBe(200);
  });

  it("BVA16: should accept ShopNumber prefix 094", async () => {
    const res = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        shopNumber: "0941234567",
      });

    expect(res.status).toBe(200);
  });

  it("BVA17: should reject invalid ShopNumber prefixes 095 and 090", async () => {
    const res1 = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        shopNumber: "0951234567",
      });

    const res2 = await request(app)
      .put("/shop/edit")
      .set("Authorization", `Bearer ${trader1Token}`)
      .send({
        id: trader1ShopId,
        ...validShopData,
        shopNumber: "0901231234",
      });

    expect(res1.status).toBe(400);
    expect(res2.status).toBe(400);
  });
});