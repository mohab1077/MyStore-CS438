// tests/shop.service.test.ts

import { shopServices } from "../services/shopServices";
import { Shop } from "../classes/shop";

describe("shopServices Solitary Unit Tests", () => {
  const userId = "user123";
  const shopId = "shop123";

  const fakeNewShop = new Shop(
    "description",
    "logo.png",
    "my-store",
    userId,
    "Test Shop",
    "0911111111",
    ["phones"]
  );

  const fakeExistingShop = new Shop(
    "description",
    "logo.png",
    "my-store",
    userId,
    "Test Shop",
    "0911111111",
    ["phones"],
    shopId
  );

  let fakeRepo: any;
  let service: shopServices;

  beforeEach(() => {
    fakeRepo = {
      editCategory: jest.fn(),
      CreateShop: jest.fn(),
      GetMyShops: jest.fn(),
      editShop: jest.fn(),
    };

    service = new shopServices(fakeRepo);
  });

  describe("editCategory", () => {
    it("should return 400 if shop not found", async () => {
      fakeRepo.editCategory.mockResolvedValue(null);

      const result = await service.editCategory(fakeExistingShop);

      expect(result).toEqual({
        status: 400,
        msg: "shop not found.",
      });

      expect(fakeRepo.editCategory).toHaveBeenCalledWith(fakeExistingShop);
    });

    it("should return 200 if categories updated successfully", async () => {
      fakeRepo.editCategory.mockResolvedValue({ _id: shopId });

      const result = await service.editCategory(fakeExistingShop);

      expect(result).toEqual({
        status: 200,
        msg: "Categories updated successfully.",
      });
    });
  });

  describe("createShop", () => {
    it("should return 400 if shop id already taken", async () => {
      fakeRepo.CreateShop.mockResolvedValue(null);

      const result = await service.createShop(fakeNewShop);

      expect(result).toEqual({
        status: 400,
        msg: "this shop id already taken",
      });
    });

    it("should return 400 if trader has too many shops", async () => {
      fakeRepo.CreateShop.mockResolvedValue(false);

      const result = await service.createShop(fakeNewShop);

      expect(result).toEqual({
        status: 400,
        msg: "something wrong",
      });
    });

    it("should return 200 if shop created successfully", async () => {
      fakeRepo.CreateShop.mockResolvedValue({ _id: shopId });

      const result = await service.createShop(fakeNewShop);

      expect(result).toEqual({
        status: 200,
        msg: "shop has been created",
      });
    });
  });

  describe("getMyShops", () => {
    it("should return 203 if trader has no shops", async () => {
      fakeRepo.GetMyShops.mockResolvedValue([]);

      const result = await service.getMyShops(userId);

      expect(result).toEqual({
        status: 203,
        msg: [],
      });
    });

    it("should return 200 if trader has shops", async () => {
      const shops = [{ _id: shopId, ShopName: "Test Shop" }];

      fakeRepo.GetMyShops.mockResolvedValue(shops);

      const result = await service.getMyShops(userId);

      expect(result).toEqual({
        status: 200,
        msg: shops,
      });
    });
  });

  describe("editShop", () => {
    it("should return 400 if shop not found", async () => {
      fakeRepo.editShop.mockResolvedValue(null);

      const result = await service.editShop(
        "New Shop",
        "logo.png",
        "description",
        "0922222222",
        shopId
      );

      expect(result).toEqual({
        status: 400,
        msg: "shop not found.",
      });
    });

    it("should return 200 if shop information updated successfully", async () => {
      fakeRepo.editShop.mockResolvedValue({ _id: shopId });

      const result = await service.editShop(
        "New Shop",
        "logo.png",
        "description",
        "0922222222",
        shopId
      );

      expect(result).toEqual({
        status: 200,
        msg: "shop Information updated successfully.",
      });
    });
  });
});