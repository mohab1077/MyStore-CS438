import { Shop } from "../classes/shop";
import { shopModel } from "../modules/shop";


export class ShopRepository {
    async editCategory(shop: Shop) {
        const find = await shopModel.findById(shop.getshopid());

        if (!find) {
            return null;
        }

        find.category = shop.category;

        await find.save();

        return find;
    }

    async CreateShop(shop: Shop) {

        const find = await shopModel.findOne({
            websiteId: shop.getwebsiteId(),
        });

        if (find) {
            return null;
        }

        const count = await shopModel.countDocuments({
            userId: shop.getuserid(),
        });

        if (count > 10) {
            return false;
        }

        return await shopModel.create(shop.toPersistence());
    }
    async GetMyShops(id: string) {

        const find = await shopModel.find(
            { userId: id },
            {
                _id: 1,
                ShopName: 1,
                logo: 1,
                Status: 1,
                websiteId:1
            }
        );


        return find;
    }

    async findById(id:string){
        const find = await shopModel.findById(id);
        return find;
    }
}