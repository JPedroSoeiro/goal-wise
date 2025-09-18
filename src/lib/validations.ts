import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido." }),
  password: z.string().min(1, { message: "Senha é obrigatória." }),
});

export const registerSchema = z.object({
  name: z.string().min(4, { message: "Nome invalido" }),
  email: z
    .string()
    .email({ message: "Email invalido" })
    .refine((email) => email.includes(".com"), {
      message: "Email invalido",
    }),
  password: z
    .string()
    .min(5, { message: "Senha invalida" })
    .refine((password) => /[a-zA-Z]/.test(password) && /\d/.test(password), {
      message: "Senha invalida",
    }),
});
