// tests/shop.repository.test.ts

import mongoose from "mongoose";
import { ShopRepository } from "../Repository/shop";
import { shopModel } from "../modules/shop";
import { Shop } from "../classes/shop";

describe("ShopRepository Unit Tests", () => {
    const userId = new mongoose.Types.ObjectId();
    const shopId = new mongoose.Types.ObjectId();

    const fakeShop = new Shop(
        "description",
        "logo.png",
        "my-store",
        userId.toString(),
        "Test Shop",
        "0911111111",
        ["phones"],
        shopId.toString()
    );

    let repo: ShopRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        repo = new ShopRepository();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("editCategory", () => {
        it("should return null if shop not found", async () => {
            jest.spyOn(shopModel, "findById").mockResolvedValue(null);

            const result = await repo.editCategory(fakeShop);

            expect(result).toBeNull();
        });

        it("should update category and return shop if found", async () => {
            const foundShop = new shopModel({
                websiteId: "my-store",
                userId,
                ShopName: "Test Shop",
                logo: "logo.png",
                description: "description",
                shopNumber: "0911111111",
                Status: "active",
                category: [],
            });

            jest.spyOn(foundShop, "save").mockResolvedValue(foundShop);
            jest.spyOn(shopModel, "findById").mockResolvedValue(foundShop);

            const result = await repo.editCategory(fakeShop);

            expect(foundShop.save).toHaveBeenCalled();
            expect(result).toEqual(foundShop);
        });
    });

    describe("CreateShop", () => {
        it("should return null if websiteId already exists", async () => {
            const existingShop = new shopModel({
                websiteId: "my-store",
                userId,
                ShopName: "Existing Shop",
                logo: "logo.png",
                description: "description",
                shopNumber: "0911111111",
                Status: "active",
                category: ["phones"],
            });

            jest.spyOn(shopModel, "findOne").mockResolvedValue(existingShop);

            const result = await repo.CreateShop(fakeShop);

            expect(result).toBeNull();
        });

        it("should return false if trader has more than 10 shops", async () => {
            jest.spyOn(shopModel, "findOne").mockResolvedValue(null);
            jest.spyOn(shopModel, "countDocuments").mockResolvedValue(11);

            const result = await repo.CreateShop(fakeShop);

            expect(result).toBe(false);
        });

        it("should create shop successfully", async () => {
            const createdShop = new shopModel({
                websiteId: "my-store",
                userId,
                ShopName: "Test Shop",
                logo: "logo.png",
                description: "description",
                shopNumber: "0911111111",
                Status: "active",
                category: ["phones"],
            });

            jest.spyOn(shopModel, "findOne").mockResolvedValue(null);
            jest.spyOn(shopModel, "countDocuments").mockResolvedValue(2);
            jest.spyOn(shopModel, "create").mockImplementationOnce(async function () {
                return createdShop;
            } as any);
            const result = await repo.CreateShop(fakeShop);

            expect(result).toEqual(createdShop);
        });
    });

    describe("GetMyShops", () => {
        it("should return shops for trader", async () => {
            const shops = [
                new shopModel({
                    websiteId: "my-store",
                    userId,
                    ShopName: "Test Shop",
                    logo: "logo.png",
                    description: "description",
                    shopNumber: "0911111111",
                    Status: "active",
                    category: ["phones"],
                }),
            ];

            jest.spyOn(shopModel, "find").mockResolvedValue(shops);

            const result = await repo.GetMyShops(userId.toString());

            expect(result).toEqual(shops);
        });
    });

    describe("findById", () => {
        it("should return shop by id", async () => {
            const foundShop = new shopModel({
                websiteId: "my-store",
                userId,
                ShopName: "Test Shop",
                logo: "logo.png",
                description: "description",
                shopNumber: "0911111111",
                Status: "active",
                category: ["phones"],
            });

            jest.spyOn(shopModel, "findById").mockResolvedValue(foundShop);

            const result = await repo.findById(shopId.toString());

            expect(result).toEqual(foundShop);
        });
    });

    describe("findShopIdByWebsiteId", () => {
        it("should return shop id by websiteId", async () => {
            const foundShop = new shopModel({
                websiteId: "my-store",
                userId,
                ShopName: "Test Shop",
                logo: "logo.png",
                description: "description",
                shopNumber: "0911111111",
                Status: "active",
                category: ["phones"],
            });

            jest.spyOn(shopModel, "findOne").mockResolvedValue(foundShop);

            const result = await repo.findShopIdByWebsiteId("my-store");

            expect(result).toEqual(foundShop);
        });
    });

    describe("editShop", () => {
        it("should return null if shop not found", async () => {
            jest.spyOn(shopModel, "findById").mockResolvedValue(null);

            const result = await repo.editShop(
                "New Shop",
                "new-logo.png",
                "new description",
                "0922222222",
                shopId.toString()
            );

            expect(result).toBeNull();
        });

        it("should update shop information and return shop", async () => {
            const foundShop = new shopModel({
                websiteId: "my-store",
                userId,
                ShopName: "Old Shop",
                logo: "old-logo.png",
                description: "old description",
                shopNumber: "0911111111",
                Status: "active",
                category: ["phones"],
            });

            jest.spyOn(foundShop, "save").mockResolvedValue(foundShop);
            jest.spyOn(shopModel, "findById").mockResolvedValue(foundShop);

            const result = await repo.editShop(
                "New Shop",
                "new-logo.png",
                "new description",
                "0922222222",
                shopId.toString()
            );

            expect(foundShop.save).toHaveBeenCalled();
            expect(result).toEqual(foundShop);
        });
    });
});