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