import { product } from "../classes/product";
import { ProductRepository } from "../Repository/product";

export class ProductServices {
  constructor(private ProductRepo: ProductRepository) {}

  async createProductServices(
    prod: product,
    category: string[]
  ) {
    const find = await this.ProductRepo.CreateProd(prod, category);

    if (find === null) {
      return {
        status: 400,
        msg: "shop not found",
      };
    }

    if (find === false) {
      return {
        status: 400,
        msg: "this category not found",
      };
    }

    return {
      status: 200,
      msg: "Product created successfully",
    };
  }

  async editProductServices(
    prod: product,
    category: string[]
  ) {
    const find = await this.ProductRepo.EditProd(prod, category);

    if (find === null) {
      return {
        status: 400,
        msg: "shop not found",
      };
    }

    if (find === false) {
      return {
        status: 400,
        msg: "this category not found",
      };
    }

    if (find === undefined) {
      return {
        status: 400,
        msg: "product not found",
      };
    }

    return {
      status: 200,
      msg: "Product updated successfully",
    };
  }

  async deleteProductServices(
    _id: string,
    id: string
  ) {
    const find = await this.ProductRepo.DeleteProd(_id, id);

    if (find === null) {
      return {
        status: 400,
        msg: "shop not found",
      };
    }

    if (find === false) {
      return {
        status: 400,
        msg: "product not found",
      };
    }

    return {
      status: 200,
      msg: "product has been Deleted",
    };
  }

  async getProductServices(
    id: string,
    page: number
  ) {
    const find = await this.ProductRepo.GetProd(id, page);

    if (!find) {
      return {
        status: 400,
        msg: "shop not found",
      };
    }

    return {
      status: 200,
      msg: find,
    };
  }
}