// testes/validation.test.ts
import { validateLogin, validateRegister } from "../hooks/useValidation";

describe("Validação de Login (Zod)", () => {
  it("deve reprovar e-mail inválido", () => {
    const result = validateLogin({ email: "x", password: "12345678" });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBe("E-mail inválido");
  });

  it("deve aprovar credenciais válidas", () => {
    const result = validateLogin({ email: "teste@teste.com", password: "12345678" });
    expect(result.valid).toBe(true);
  });
});

describe("Validação de Cadastro (Zod)", () => {
  it("deve reprovar nome curto e senha curta", () => {
    const result = validateRegister({ name: "A", email: "a@b.com", password: "123" });
    expect(result.valid).toBe(false);
    expect(Object.keys(result.errors).length).toBeGreaterThan(0);
  });

  it("deve aprovar cadastro válido", () => {
    const result = validateRegister({
      name: "Alice",
      email: "alice@teste.com",
      password: "12345678",
    });
    expect(result.valid).toBe(true);
  });
});
