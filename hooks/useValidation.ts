import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const registerSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export function validateLogin(data: { email: string; password: string }) {
  const result = loginSchema.safeParse(data);
  if (result.success) {
    return { valid: true, errors: {} };
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    if (issue.path.length > 0) {
      const field = issue.path[0].toString();
      errors[field] = issue.message;
    }
  });

  return { valid: false, errors };
}

export function validateRegister(data: { name: string; email: string; password: string }) {
  const result = registerSchema.safeParse(data);
  if (result.success) {
    return { valid: true, errors: {} };
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    if (issue.path.length > 0) {
      const field = issue.path[0].toString();
      errors[field] = issue.message;
    }
  });

  return { valid: false, errors };
}
