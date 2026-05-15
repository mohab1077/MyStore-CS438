import { usermodel } from "../modules/user";

export class UserShopRepository{
    async login(email:string) {
    const finduser = await usermodel.findOne({
      email: email,
    });

    if (!finduser) {
      return null;
    }

    return finduser;
  }

  async findByEmail(email: string) {
    return await usermodel.findOne({ email });
  }

   async createTrader(data: {
    email: string;
    password: string;
    phone: string;
    name: string;
  }) {

    return await usermodel.create({
      email: data.email,
      password: data.password,
      phone: data.phone,
      name: data.name,
      type: "trader",
    });
  }

  
}