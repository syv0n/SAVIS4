describe('template spec', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/twomeans')
    })
   
    it('passes', () => {
      cy.viewport(1920, 1080)
      cy.visit('localhost:4200/twomeans')
      // cy.get('.form-incline > #forget').click()
    })
    it ('should select and load sample 1', () => {
        cy.get('.border-t-0').select("Sample 1")
        cy.get('#loadData').click()
       


    })
    it ('should select and load sample 2', () => {
        cy.get('.border-t-0').select("Sample 2")
        cy.get('.w-3\\/12 > div.w-full > :nth-child(2)').click()

    })
    it ('should reset the chart', () => {
        cy.get('.border-t-0').select("Sample 1")
        cy.get('#loadData').click()
        
        cy.get('div.w-full > :nth-child(3)').first().click()
        
        cy.get('.border-t-0').should('have.value', '')
    })
    it ('should check if run simulation button is disabled on an empty chart', () => {
        cy.get('.w-3\\/12 > .mt-1').should('be.disabled')

    })


    it ('should click the run simulation chart when there is data', () => {
        cy.get('.border-t-0').select("Sample 1")
        cy.get('#loadData').click()
        cy.get('.w-3\\/12 > .mt-1').click({ force: true });

    })

    it ('should input a number in the run simulation inputfiled when there is data', () => {
        cy.get('.border-t-0').select("Sample 1")
        cy.get('#loadData').click()
        cy.get(':nth-child(6) > .w-3\\/12 > .border-gray-300').type("2",{ force: true })
        cy.get('.w-3\\/12 > .mt-1').click({ force: true });

    })
  
    it ('should increase the min value', () => {
        cy.get('.border-t-0').select("Sample 1")
        cy.get('#loadData').click()
        cy.get('.w-3\\/12 > .mt-1').click({ force: true });
        cy.get('#min-interValue').type('{uparrow}',{ force: true })
    })
    it ('should increase the max value', () => {
        cy.get('.border-t-0').select("Sample 1")
        cy.get('#loadData').click()
        cy.get('.w-3\\/12 > .mt-1').click({ force: true });
        cy.get('#max-interValue').type('{uparrow}',{ force: true })
    })
    it ('should check the max box', () => {
        cy.get('.border-t-0').select("Sample 1")
        cy.get('#loadData').click()
        cy.get('.w-3\\/12 > .mt-1').click({ force: true });
        cy.get('#includeMax').click({ force: true })
    })
    it ('should check the min box', () => {
        cy.get('.border-t-0').select("Sample 1")
        cy.get('#loadData').click()
        cy.get('.w-3\\/12 > .mt-1').click({ force: true });
        cy.get('#includeMin').click({ force: true })
    })
   
   
    
    

    
})