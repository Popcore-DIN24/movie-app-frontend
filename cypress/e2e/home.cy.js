describe("Home Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("loads the home page", () => {
    cy.get('[data-testid="home-page"]').should("exist");
    cy.get('[data-testid="city-select"]').should("be.visible");
  });

  it("loads movies from API", () => {
    cy.get('[data-testid="movie-card"]', { timeout: 10000 })
      .should("have.length.greaterThan", 0);
  });

  it("filters movies by city", () => {
    cy.get('[data-testid="city-select"]').select("Oulu");

    cy.get('[data-testid="movie-card"]', { timeout: 8000 })
      .should("have.length.greaterThan", 0);
  });
});
