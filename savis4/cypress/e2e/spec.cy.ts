describe('template spec', () => {
  it('passes', () => {
    cy.viewport(1920, 1080)
    cy.visit('localhost:4200/')
    // cy.get('.form-incline > #forget').click()
  })
})