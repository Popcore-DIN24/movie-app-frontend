describe("Navbar Component", () => {

  beforeEach(() => {
    cy.visit("/");
  });

  it("renders the navbar", () => {
    cy.get('[data-testid="navbar"]').should("exist");
  });

  it("opens and closes the mobile menu", () => {
    cy.get('[data-testid="mobile-menu"]').click();
    cy.get(".navbar__links").should("have.class", "open");

    cy.get('[data-testid="mobile-menu"]').click();
    cy.get(".navbar__links").should("not.have.class", "open");
  });

  it("opens theaters dropdown", () => {
    cy.contains("Theaters").click();
    cy.get('[data-testid="theaters-dropdown-menu"]').should("be.visible");
  });

  it("opens language dropdown and switches language", () => {
    cy.get('[data-testid="lang-dropdown"]').click();

    // Switch language to English
    cy.contains("English").click();

    // Validate text changed
    cy.contains("Home").should("exist");
  });

  it("opens user dropdown", () => {
    cy.get('[data-testid="user-btn"]').click();
    cy.get('[data-testid="user-dropdown"]').should("be.visible");
  });

  it("opens search modal", () => {
    cy.get('[data-testid="search-btn"]').click();

    cy.get('[data-testid="search-modal"]').should("exist");
  });

});
