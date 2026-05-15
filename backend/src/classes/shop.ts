 export class Shop {
    constructor(
        private websiteId: string,
        private userId: string,
        public  ShopName: string,
        public shopNumber: string,
        public category: string[],
        private shopId: string | null = null,

    ) { }
   

   getshopid(){
    return this.shopId
   }
   
   getwebsiteId(){
    return this.websiteId
   }
   getuserid(){
    return this.userId
   }

   toPersistence() {
    return {
      websiteId: this.websiteId,
      userId: this.userId,
      ShopName: this.ShopName,
      shopNumber: this.shopNumber,
      category: this.category,
    };
  }
}