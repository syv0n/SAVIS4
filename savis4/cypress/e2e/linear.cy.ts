describe('template spec', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/LR')
    })
    
    it('passes', () => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/LR')
    })
    
    it('should input data points and load the chart', () => {
        cy.get('#dataPoints').type('1,3 \n 2,5 \n 3,7 \n 4,9 \n 5,11')
        cy.get('button.btn').click()
        cy.wait(1000)
    })
    
    it('should click the choose file button', () => {
        cy.get('.file-input .btn').click()
    })
})