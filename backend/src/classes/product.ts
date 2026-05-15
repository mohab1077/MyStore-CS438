
interface IAttribute {
    name: string;     // مثلا: Color
    value: string;    // مثلا: Red
}

export class product{
constructor(
          private storeId: string,
          public name: string,
          public price: number,
          public description: string,
          public imgs: string[],
          public attributes: IAttribute[],
          public stock: number,
          public category: string,
          public status: "active" | "hidden",
          private productId: string | null = null

    ) { }

    GetStoreId(){
        return this.storeId
    }
    GetProductId(){
        return this.productId
    }

     toPersistence() {
    return {
      name: this.name,
      price: this.price,
      description: this.description,
      imgs: this.imgs,
      attributes: this.attributes,
      stock: this.stock,
      category: this.category,
      storeId: this.storeId,
    };
}
   
}



