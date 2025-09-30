describe('template spec', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/correlation')
    })
    it('passes', () => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/correlation')
      })

    it('should input data in X Values', () => {
      cy.get('#columnX').type('1,2,3,4,5')
      })
   it('should input data in Y Values', () => {
      cy.get('#columnY').type('1,2,3,4,5')
      })
   it('should show error when both inputs are not of same length', () => {
      cy.get('#columnX').type('1,2,3')
      cy.get('#columnY').type('1,2,3,4,5')
      cy.get(':nth-child(6) > .btn').click()
      cy.wait(500)

      })
    it('should input values and calculate data', () => {
      cy.get('#columnX').type('1,2,3,4,5')
      cy.get('#columnY').type('33,44,22,17,99')
      cy.get(':nth-child(6) > .btn').click()
      cy.wait(500)
      })
    it('should click file input', () => {
      cy.get('label.file-input span.btn').click()
      })      
})
