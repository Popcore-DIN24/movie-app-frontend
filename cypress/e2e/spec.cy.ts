describe('basic testing', () => {
  it('passes', () => {
    cy.visit(' http://localhost:5173/')
  })

  // test window title
  it('has correct title', ()=>{
    cy.title().should('contain', 'demo')
  })
})