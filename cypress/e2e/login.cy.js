/// <reference types="cypress" />

describe("Login Page", () => {

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("http://localhost:5173/login");
  });

  it("renders login page", () => {
    cy.get('[data-testid="login-page"]', { timeout: 10000 })
      .should("exist");
  });

  it("allows typing", () => {
    cy.get('[data-testid="email-input"]')
      .type("test@example.com")
      .should("have.value", "test@example.com");

    cy.get('[data-testid="password-input"]')
      .type("123456")
      .should("have.value", "123456");
  });

  it("toggles password visibility", () => {
    cy.get('[data-testid="password-input"]').should("have.attr", "type", "password");
    cy.get('[data-testid="toggle-password-btn"]').click();
    cy.get('[data-testid="password-input"]').should("have.attr", "type", "text");
  });

  it("checks Remember Me", () => {
    cy.get('[data-testid="remember-me-checkbox"]').check().should("be.checked");
    cy.get('[data-testid="remember-me-checkbox"]').uncheck().should("not.be.checked");
  });

  it("shows error message on failed login", () => {
    cy.intercept(
      "POST",
      "https://wdfinpopcorebackend-fyfuhuambrfnc3hz.swedencentral-01.azurewebsites.net/user/login",
      {
        statusCode: 400,
        body: { message: "Invalid credentials" }
      }
    );

    cy.get('[data-testid="email-input"]').type("wrong@example.com");
    cy.get('[data-testid="password-input"]').type("wrongpass");
    cy.get('[data-testid="login-submit-btn"]').click();

    cy.get('[data-testid="login-msg"]').should("contain.text", "Invalid credentials");
  });

  it("navigates to forgot password page", () => {
    cy.get('[data-testid="forgot-password-btn"]').click();
    cy.url().should("include", "/forgot-password");
  });

  it("successful login stores user and handles Remember Me", () => {
    const fakeUser = {
      id: 1,
      name: "Minou",
      email: "test@example.com"
    };

    cy.intercept(
      "POST",
      "https://wdfinpopcorebackend-fyfuhuambrfnc3hz.swedencentral-01.azurewebsites.net/user/login",
      {
        statusCode: 200,
        body: {
          message: "Login successful",
          user: fakeUser
        }
      }
    ).as("loginRequest");

    cy.get('[data-testid="email-input"]').type("test@example.com");
    cy.get('[data-testid="password-input"]').type("123456");

    // remember me
    cy.get('[data-testid="remember-me-checkbox"]').check();

    cy.get('[data-testid="login-submit-btn"]').click();
    cy.wait("@loginRequest");

    cy.then(() => {
      expect(localStorage.getItem("user")).to.not.be.null;
      expect(localStorage.getItem("rememberEmail")).to.equal("test@example.com");
      expect(localStorage.getItem("rememberPassword")).to.equal("123456");
    });
  });

});
