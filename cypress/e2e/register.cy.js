/// <reference types="cypress" />

describe("Register Page", () => {

  beforeEach(() => {
    cy.visit("http://localhost:5173/signup");
  });

  it("renders all register fields", () => {
    cy.get('[data-testid="register-page"]').should("exist");
    cy.get('[data-testid="full-name-input"]').should("exist");
    cy.get('[data-testid="email-input"]').should("exist");
    cy.get('[data-testid="phone-input"]').should("exist");
    cy.get('[data-testid="password-input"]').should("exist");
    cy.get('[data-testid="register-submit-btn"]').should("exist");
  });

  it("allows typing in all fields", () => {
    cy.get('[data-testid="full-name-input"]').type("John Doe").should("have.value", "John Doe");
    cy.get('[data-testid="email-input"]').type("john@example.com").should("have.value", "john@example.com");
    cy.get('[data-testid="phone-input"]').type("09123456789").should("have.value", "09123456789");
    cy.get('[data-testid="password-input"]').type("Weakpass").should("have.value", "Weakpass");
  });

  it("shows password validation error for weak password", () => {
    cy.get('[data-testid="password-input"]').type("weak");
    cy.get('[data-testid="password-error"]').should(
      "contain.text",
      "Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 symbol and be at least 8 characters long."
    );
  });

  it("toggles password visibility", () => {
    cy.get('[data-testid="password-input"]').should("have.attr", "type", "password");
    cy.get('[data-testid="toggle-password-btn"]').click();
    cy.get('[data-testid="password-input"]').should("have.attr", "type", "text");
    cy.get('[data-testid="toggle-password-btn"]').click();
    cy.get('[data-testid="password-input"]').should("have.attr", "type", "password");
  });

  it("shows error message when API returns error", () => {
    // intercept با wildcard و پاسخ 400
    cy.intercept("POST", "**/signup", { statusCode: 400, body: { message: "Registration failed" } });

    cy.get('[data-testid="full-name-input"]').type("John Doe");
    cy.get('[data-testid="email-input"]').type("john@example.com");
    cy.get('[data-testid="phone-input"]').type("09123456789");
    cy.get('[data-testid="password-input"]').type("Strong1$Pass");

    cy.get('[data-testid="register-submit-btn"]').click();

    // پیام خطا باید روی صفحه باشد، navigate اتفاق نمی‌افتد
    cy.get('[data-testid="register-msg"]').should("contain.text", "Registration failed");
  });

  it("successful registration redirects to login", () => {
    // intercept موفق با wildcard
    cy.intercept("POST", "**/signup", { statusCode: 200, body: { message: "User registered successfully" } });

    cy.get('[data-testid="full-name-input"]').type("John Doe");
    cy.get('[data-testid="email-input"]').type("john@example.com");
    cy.get('[data-testid="phone-input"]').type("09123456789");
    cy.get('[data-testid="password-input"]').type("Strong1$Pass");

    cy.get('[data-testid="register-submit-btn"]').click();

    // چون کامپوننت شما setTimeout برای navigate دارد، بهترین راه assert روی URL
    cy.url({ timeout: 5000 }).should("include", "/login");
  });

});
