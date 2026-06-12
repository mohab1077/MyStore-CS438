// src/features/user/types/user.types.ts

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  phone: string;
  name: string;
};



export type SendCodeInput = {
  email: string;
};

export type ConfirmCodeInput = {
  email: string;
  code: string;
};

export type ChangePasswordInput = {
  password: string;
};

export type EditInfoInput = {
  email: string;
  phone: string;
};

export type UserInfo = {
  
  email: string;
  phone: string;
};
