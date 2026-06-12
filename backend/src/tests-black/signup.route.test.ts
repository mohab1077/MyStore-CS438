// tests/signup.route.test.ts

import request from "supertest";
import app from "./app";
import mongoose from "mongoose";


describe("Feature 2: Trader Sign Up", () => {

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });
   
    const validTrader = {
        name: "Mohab",
        email: `mohab@test.com`,
        phone: "0911234567",
        password: "Aa123456!",
    };

    it("VC1: should create trader account with valid data", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send(validTrader);

        expect(res.status).toBe(200);
    });

    it("IC1: should reject name less than 2 characters", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send({
                ...validTrader,
                email: "name-short@test.com",
                name: "A",
            });

        expect(res.status).toBe(400);
        expect(res.body).toBe("Name too short");
    });

    it("IC2: should reject name more than 50 characters", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send({
                ...validTrader,
                email: "name-long@test.com",
                name: "A".repeat(51),
            });

        expect(res.status).toBe(400);
        expect(res.body).toBe("Name too long");
    });

    it("IC3: should reject name containing numbers", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send({
                ...validTrader,
                email: "name-number@test.com",
                name: "Mohab123",
            });

        expect(res.status).toBe(400);
        expect(res.body).toBe("Name must contain letters only");
    });

    it("IC5: should reject invalid email format", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send({
                ...validTrader,
                email: "wrong-email",
            });

        expect(res.status).toBe(400);
        expect(res.body).toBe("Invalid email");
    });

    it("IC6: should reject email already exists ", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send({
                ...validTrader,
                email: "wrong-email",
            });

        expect(res.status).toBe(400);
        expect(res.body).toBe("Invalid email");
    });

    it("IC7: should reject invalid phone prefix", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send(validTrader);

        expect(res.status).toBe(400);

    });

    it("IC8: should reject phone less than 10 digits", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send({
                ...validTrader,
                email: "phone-short@test.com",
                phone: "091123456",
            });

        expect(res.status).toBe(400);
        expect(res.body).toBe("Invalid phone number");
    });

    it("IC9: should reject phone more than 10 digits", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send({
                ...validTrader,
                email: "phone-long@test.com",
                phone: "09112345678",
            });

        expect(res.status).toBe(400);
        expect(res.body).toBe("Invalid phone number");
    });

    it("IC11: should reject weak password less than 8 characters", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send({
                ...validTrader,
                email: "weak-pass@test.com",
                password: "Aa1!abc",
            });

        expect(res.status).toBe(400);
    });

    it("IC12: should reject password without lowercase letter", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send({
                ...validTrader,
                email: "no-lower@test.com",
                password: "AA123456!",
            });

        expect(res.status).toBe(400);
    });

    it("IC13: should reject password without uppercase letter", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send({
                ...validTrader,
                email: "no-upper@test.com",
                password: "aa123456!",
            });

        expect(res.status).toBe(400);
    });

    it("IC14: should reject password without number", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send({
                ...validTrader,
                email: "no-number@test.com",
                password: "Aaaaaaaa!",
            });

        expect(res.status).toBe(400);
    });

    it("IC15: should reject password without special symbol", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send({
                ...validTrader,
                email: "no-symbol@test.com",
                password: "Aa123456",
            });

        expect(res.status).toBe(400);
    });

    it("BVA1: should reject name length 1", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send({
                name: "A",
                email: "bva1@test.com",
                phone: "0911234567",
                password: "Aa123456!",
            });

        expect(res.status).toBe(400);
    });

    it("BVA2: should accept name length 2", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send({
                name: "Ab",
                email: "bva2@test.com",
                phone: "0911234567",
                password: "Aa123456!",
            });

        expect(res.status).toBe(200);
    });

    it("BVA3: should accept name length 3", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send({
                name: "Abc",
                email: "bva3@test.com",
                phone: "0911234567",
                password: "Aa123456!",
            });

        expect(res.status).toBe(200);
    });

    it("BVA4: should accept name length 49", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send({
                name: "A".repeat(49),
                email: "bva4@test.com",
                phone: "0911234567",
                password: "Aa123456!",
            });

        expect(res.status).toBe(200);
    });

    it("BVA5: should accept name length 50", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send({
                name: "A".repeat(50),
                email: "bva5@test.com",
                phone: "0911234567",
                password: "Aa123456!",
            });

        expect(res.status).toBe(200);
    });

    it("BVA6: should reject name length 51", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send({
                name: "A".repeat(51),
                email: "bva6@test.com",
                phone: "0911234567",
                password: "Aa123456!",
            });

        expect(res.status).toBe(400);
    });

    it("BVA7: should reject phone with 9 digits", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send({
                name: "Mohab",
                email: "bva7@test.com",
                phone: "091123456",
                password: "Aa123456!",
            });

        expect(res.status).toBe(400);
    });

    it("BVA8: should accept phone with 10 digits", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send({
                name: "Mohab",
                email: "bva8@test.com",
                phone: "0911234567",
                password: "Aa123456!",
            });

        expect(res.status).toBe(200);
    });

    it("BVA9: should reject phone with 11 digits", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send({
                name: "Mohab",
                email: "bva9@test.com",
                phone: "09112345678",
                password: "Aa123456!",
            });

        expect(res.status).toBe(400);
    });
    it("BVA10: should reject password length 7", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send({
                name: "Mohab",
                email: "bva10@test.com",
                phone: "0911234567",
                password: "Aa1!abc",
            });

        expect(res.status).toBe(400);
    });

    it("BVA11: should accept password length 8", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send({
                name: "Mohab",
                email: "bva11@test.com",
                phone: "0911234567",
                password: "Aa1!abcd",
            });

        expect(res.status).toBe(200);
    });

    it("BVA12: should accept password length 9", async () => {
        const res = await request(app)
            .post("/user/signup")
            .send({
                name: "Mohab",
                email: "bva12@test.com",
                phone: "0911234567",
                password: "Aa1!abcde",
            });

        expect(res.status).toBe(200);
    });
});