describe("Navbar", () => {
  beforeEach(() => {
    // Visit the home page
    cy.visit("http://localhost:5173/");
  });

  it("opens and closes the mobile menu", () => {
    cy.get('[data-testid="mobile-menu"]')
      .first()
      .click({ force: true });

    cy.get(".navbar__links").should("have.class", "open");

    cy.get('[data-testid="mobile-menu"]')
      .first()
      .click({ force: true });

    cy.get(".navbar__links").should("not.have.class", "open");
  });

  it("opens theaters dropdown", () => {
    cy.contains("Theaters", { timeout: 10000 })
      .first()
      .click({ force: true });

    cy.get('[data-testid="theaters-dropdown-menu"]')
      .first()
      .scrollIntoView()
      .should("be.visible");
  });

  it("opens language dropdown and switches language", () => {
    cy.get('[data-testid="lang-dropdown"]')
      .first()
      .click({ force: true });

    cy.get('[data-testid="lang-dropdown"] ul')
      .should("be.visible");

    // Switch to English
    cy.get('[data-testid="lang-dropdown"]')
      .contains("English")
      .click({ force: true });

    // Switch to Finnish
    cy.get('[data-testid="lang-dropdown"]')
      .contains("Suomi")
      .click({ force: true });
  });

  it("opens user dropdown", () => {
    cy.get('[data-testid="user-btn"]')
      .first()
      .click({ force: true });

    cy.get('[data-testid="user-dropdown"]')
      .first()
      .scrollIntoView()
      .should("be.visible");
  });

    
  });

