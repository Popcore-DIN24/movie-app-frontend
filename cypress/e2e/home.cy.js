describe("Home Page with real API", () => {
  beforeEach(() => {
    // Visit the home page with full URL
    cy.visit("http://localhost:5173/");
  });

  it("renders the home page and city selector", () => {
    // Wait for the main container
    cy.get('[data-testid="home-page"]', { timeout: 30000 }).should("exist");

    // Check that city selector dropdown is visible
    cy.get('[data-testid="city-select"]', { timeout: 30000 }).should("be.visible");
  });

  it("loads movies from real API", () => {
    // Verify that movie cards are rendered
    cy.get('[data-testid="movie-card"]', { timeout: 30000 }).should(($cards) => {
      expect($cards.length).to.be.greaterThan(0);
    });
  });

  it("filters movies by city", () => {
    // Select "Oulu" in the city dropdown
    cy.get('[data-testid="city-select"]').select("Oulu");

    // Check that filtered movies are displayed
    cy.get('[data-testid="movie-card"]', { timeout: 30000 }).should(($cards) => {
      expect($cards.length).to.be.greaterThan(0);
    });
  });

  it("scrolls to category when category button is clicked", () => {
    // Click the first category button using data-testid
    cy.get('[data-testid^="category-btn-"]', { timeout: 30000 }).first().click();

    // Check that the corresponding genre row is rendered
    cy.get('[data-testid="genre-row"]', { timeout: 30000 }).should("exist");
  });
});
