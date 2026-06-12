// tests/product.service.test.ts

import { product } from "../classes/product";
import { ProductServices } from "../services/productServices";

describe("ProductServices", () => {
  const fakeProduct = {
  storeId: "store1",
  name: "iPhone",
  price: 1000,
  description: "phone description",
  imgs: ["img1.png"],
  attributes: [
    {
      name: "Color",
      value: "Black",
    },
  ],
  stock: 10,
  category: "phones",
  status: "active",
  GetProductId: jest.fn().mockReturnValue("prod1"),
  GetStoreId: jest.fn().mockReturnValue("store1"),
  toPersistence: jest.fn(),
};

  const category = ["phones", "laptops"];

  describe("createProductServices", () => {
    it("should return 400 if category not found", async () => {
      const fakeRepo = {
        CreateProd: jest.fn().mockResolvedValue(false),
      };

      const service = new ProductServices(fakeRepo as any);

      const result = await service.createProductServices(fakeProduct as any, category);

      expect(result).toEqual({
        status: 400,
        msg: "this category not found",
      });
    });

    it("should return 200 if product created successfully", async () => {
      const fakeRepo = {
        CreateProd: jest.fn().mockResolvedValue(fakeProduct),
      };

      const service = new ProductServices(fakeRepo as any);

      const result = await service.createProductServices(fakeProduct as any, category);

      expect(result).toEqual({
        status: 200,
        msg: "Product created successfully",
      });
    });
  });

  describe("editProductServices", () => {
    it("should return 400 if category not found", async () => {
      const fakeRepo = {
        EditProd: jest.fn().mockResolvedValue(false),
      };

      const service = new ProductServices(fakeRepo as any);

      const result = await service.editProductServices(fakeProduct as any, category);

      expect(result).toEqual({
        status: 400,
        msg: "this category not found",
      });
    });

    it("should return 400 if product not found", async () => {
      const fakeRepo = {
        EditProd: jest.fn().mockResolvedValue(undefined),
      };

      const service = new ProductServices(fakeRepo as any);

      const result = await service.editProductServices(fakeProduct as any, category);

      expect(result).toEqual({
        status: 400,
        msg: "product not found",
      });
    });

    it("should return 200 if product updated successfully", async () => {
      const fakeRepo = {
        EditProd: jest.fn().mockResolvedValue(fakeProduct),
      };

      const service = new ProductServices(fakeRepo as any);

      const result = await service.editProductServices(fakeProduct as any, category);

      expect(result).toEqual({
        status: 200,
        msg: "Product updated successfully",
      });
    });
  });

  describe("deleteProductServices", () => {
    it("should return 400 if product not found", async () => {
      const fakeRepo = {
        DeleteProd: jest.fn().mockResolvedValue(false),
      };

      const service = new ProductServices(fakeRepo as any);

      const result = await service.deleteProductServices("prod1", "store1");

      expect(result).toEqual({
        status: 400,
        msg: "product not found",
      });
    });

    it("should return 200 if product deleted successfully", async () => {
      const fakeRepo = {
        DeleteProd: jest.fn().mockResolvedValue(true),
      };

      const service = new ProductServices(fakeRepo as any);

      const result = await service.deleteProductServices("prod1", "store1");

      expect(result).toEqual({
        status: 200,
        msg: "product has been Deleted",
      });
    });
  });

  describe("getProductServices", () => {
    it("should return 200 with products", async () => {
      const products = {
        data: [fakeProduct],
        page: 1,
        totalPages: 1,
        total: 1,
      };

      const fakeRepo = {
        GetProd: jest.fn().mockResolvedValue(products),
      };

      const service = new ProductServices(fakeRepo as any);

      const result = await service.getProductServices("store1", 1);

      expect(result).toEqual({
        status: 200,
        msg: products,
      });
    });
  });

  describe("getWebSiteProducts", () => {
    it("should return 400 if shop not found", async () => {
      const fakeRepo = {
        GetCustomerProd: jest.fn().mockResolvedValue(null),
      };

      const fakeShopRepo = {};

      const service = new ProductServices(fakeRepo as any);

      const result = await service.getWebSiteProducts(
        "my-store",
        1,
        fakeShopRepo as any
      );

      expect(result).toEqual({
        status: 400,
        msg: "shop not found",
      });
    });

    it("should return 200 if website products found", async () => {
      const products = {
        data: [fakeProduct],
        page: 1,
        totalPages: 1,
        total: 1,
      };

      const fakeRepo = {
        GetCustomerProd: jest.fn().mockResolvedValue(products),
      };

      const fakeShopRepo = {};

      const service = new ProductServices(fakeRepo as any);

      const result = await service.getWebSiteProducts(
        "my-store",
        1,
        fakeShopRepo as any
      );

      expect(result).toEqual({
        status: 200,
        msg: products,
      });
    });
  });
});