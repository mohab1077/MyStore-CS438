import { z } from "zod";

export const EmailValidator = z
  .string()
  .email("Invalid email");

export const PhoneValidator = z
  .string()
  .regex(/^(091|092|093|094)\d{7}$/, "Invalid phone number");

export const NameValidator = z
  .string()
  .min(2, "Name too short")
  .max(50, "Name too long")
  .regex(/^[A-Za-z\u0600-\u06FF\s]+$/, "Name must contain letters only");

export const ShopNameValidator = z
  .string()
  .min(2, "Shop name too short")
  .max(80, "Shop name too long");


