import { product } from "../classes/product";
import { productModel } from "../modules/product";
import { ShopRepository } from "./shop";

export class ProductRepository {
    async CreateProd(Product: product, category: string[]) {


        if (!category.includes(Product.category)) {
            return false;
        }

        return await productModel.create(Product.toPersistence());
    }

    async EditProd(Product: product, category: string[]) {


        if (!category.includes(Product.category)) {
            return false;
        }

        const findprod = await productModel.findById(Product.GetProductId()); // edit

        if (!findprod) {
            return undefined;
        }

        if (findprod.storeId.toString() != Product.GetStoreId()) {
            return undefined;
        }

        findprod.name = Product.name;
        findprod.price = Product.price;
        findprod.description = Product.description;
        findprod.imgs = Product.imgs;
        findprod.attributes = Product.attributes;
        findprod.stock = Product.stock;
        findprod.category = Product.category;
        findprod.status = Product.status;

        await findprod.save();

        return findprod;
    }


    async DeleteProd(_id: string, id: string) {



        const findprod = await productModel.findById(_id); // edit check for if prod for the user


        if (!findprod) {
            return false;
        }

        if (findprod.storeId.toString() != id) {
            console.log(findprod.storeId.toString())
            console.log(id)
            return false;
        }

        await productModel.findByIdAndDelete(_id)
        return true;
    }

    async GetProd(id: string, page: number) {

        const LIMIT = 25;

        const skip = (page - 1) * LIMIT;



        const findprod = await productModel
            .find({ storeId: id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(LIMIT);

        const total = await productModel.countDocuments({
            storeId: id,
        });

        return {
            data: findprod,
            page,
            totalPages: Math.ceil(total / LIMIT),
            total,
        };
    }

    async GetCustomerProd(websiteId: string, page: number, shopRepo: ShopRepository) {

        const LIMIT = 25;

        const skip = (page - 1) * LIMIT;
        const find = await shopRepo.findShopIdByWebsiteId(websiteId);
        if (!find) {
            return false
        }
        const findprods = await productModel.find({ storeId: find._id, status: 'active' }).sort({ createdAt: -1 })
            .skip(skip)
            .limit(LIMIT);;

        const total = await productModel.countDocuments({ storeId: find._id, status: 'active' });

        return {
            data: findprods,
            page,
            totalPages: Math.ceil(total / LIMIT),
            total,
        };
    }


}