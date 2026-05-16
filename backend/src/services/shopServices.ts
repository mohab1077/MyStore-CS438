
import { Shop } from "../classes/shop";

import { ShopRepository } from "../Repository/shop";


export class shopServices {
  constructor(
    
    private ShopRepo: ShopRepository
  ) {}

  async editCategory(shop: Shop) {
    const find = await this.ShopRepo.editCategory(shop);

    if (!find) {
      return {
        status: 400,
        msg: "shop not found.",
      };
    }

    return {
      status: 200,
      msg: "Categories updated successfully.",
    };
  }

  async createShop(shop: Shop) {
  const find = await this.ShopRepo.CreateShop(shop);

  if (find === null) {
    return {
      status: 400,
      msg: "this shop id already taken",
    };
  }

  if (find === false) {
    return {
      status: 400,
      msg: "something wrong",
    };
  }

  return {
    status: 200,
    msg: "shop has been created",
  };
}

async getMyShops(traderId: string) {
  const find = await this.ShopRepo.GetMyShops(traderId);

  if (!find) {
    return {
      status: 400,
      msg: "No shops found.",
    };
  }

  if (find.length == 0) {
    return {
      status: 203,
      msg: [],
    };
  }

  return {
    status: 200,
    msg: find,
  };
}

  
}