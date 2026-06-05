import { product } from "../classes/product";
import { ProductRepository } from "../Repository/product";
import { ShopRepository } from "../Repository/shop";

export class ProductServices {
  constructor(private ProductRepo: ProductRepository) {}

  async createProductServices(
    prod: product,
    category: string[]
  ) {
    const find = await this.ProductRepo.CreateProd(prod, category);
  
  // if category not in list return 400
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
    


    if (find === false) {
      return {
        status: 400,
        msg: "this category not found",
      };
    }
   // if product not found or product owns to another trader 
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

 
 // if product not found or product owns to another trader 
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

    return {
      status: 200,
      msg: find,
    };
  }

  async getWebSiteProducts(
    websiteId: string,
    page: number,
    shopRepo: ShopRepository

  ) {
    const find = await this.ProductRepo.GetCustomerProd(websiteId, page,shopRepo);
    // we search by wesbite id so if not found , so shop not found
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