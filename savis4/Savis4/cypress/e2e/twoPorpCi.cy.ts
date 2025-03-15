describe('template spec', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/twoproportionsCI')
    })
   
    it('passes', () => {
      cy.viewport(1920, 1080)
      cy.visit('localhost:4200/twoproportionsCI')
      // cy.get('.form-incline > #forget').click()
    })
    it('should change the "increase by data"', () => {
        cy.get('#a-success').clear()
        cy.get('#a-success').type('5')
        cy.get('#a-failure').clear()
        cy.get('#a-failure').type('1')
        cy.get('#b-success').clear()
        cy.get('#b-success').type('15')
        cy.get('#b-failure').clear()
        cy.get('#b-failure').type('8')
        cy.get('#input-section > .lhs > .btn').click()
        cy.get('#increment').type('{uparrow}')
        cy.wait(100)
        cy.get('#increment').type('{uparrow}')
        cy.wait(100)
        cy.get('#increment').type('{uparrow}')
        cy.wait(100)
        cy.get('#increment').type('{uparrow}')
        cy.wait(100)
      
      
      
      })
    it('should input and load data into group A and B', () => {
        cy.get('#a-success').clear()
        cy.get('#a-success').type('5')
        cy.get('#a-failure').clear()
        cy.get('#a-failure').type('1')
        cy.get('#b-success').clear()
        cy.get('#b-success').type('15')
        cy.get('#b-failure').clear()
        cy.get('#b-failure').type('8')
        cy.get('#input-section > .lhs > .btn').click()
      
      
      })
      it('should input data and run simulation', () => {
        cy.get('#a-success').clear()
        cy.get('#a-success').type('5')
        cy.get('#a-failure').clear()
        cy.get('#a-failure').type('1')
        cy.get('#b-success').clear()
        cy.get('#b-success').type('15')
        cy.get('#b-failure').clear()
        cy.get('#b-failure').type('8')
        cy.get('#input-section > .lhs > .btn').click()
        cy.wait(200)
        cy.get('#num-simulations').type('0')
        cy.get(':nth-child(8) > .lhs > .btn').click()
      
      
      })
  it('should increase and decrease confidence interval', () => {
        cy.get('#a-success').clear()
        cy.get('#a-success').type('5')
        cy.get('#a-failure').clear()
        cy.get('#a-failure').type('1')
        cy.get('#b-success').clear()
        cy.get('#b-success').type('15')
        cy.get('#b-failure').clear()
        cy.get('#b-failure').type('8')
        cy.get('#input-section > .lhs > .btn').click()
        cy.wait(200)
        cy.get(':nth-child(8) > .lhs > .btn').click()
        cy.get('#confidence-level').invoke('val', 50).trigger('input');
        cy.wait(100)
        cy.get('#confidence-level').invoke('val', 60).trigger('input');
        cy.wait(100)
        cy.get('#confidence-level').invoke('val', 70).trigger('input');
        cy.wait(100)
        cy.get('#confidence-level').invoke('val', 80).trigger('input');
        cy.wait(100)
        cy.get('#confidence-level').invoke('val', 50).trigger('input');
        cy.wait(100)
        cy.get('#confidence-level').invoke('val', 40).trigger('input');
        cy.wait(100)
        cy.get('#confidence-level').invoke('val', 30).trigger('input');
        cy.wait(100)

      
      })    
  it('should build the Sampling Distribution at different confidence interval', () => {
        cy.get('#a-success').clear()
        cy.get('#a-success').type('5')
        cy.get('#a-failure').clear()
        cy.get('#a-failure').type('1')
        cy.get('#b-success').clear()
        cy.get('#b-success').type('15')
        cy.get('#b-failure').clear()
        cy.get('#b-failure').type('8')
        cy.get('#input-section > .lhs > .btn').click()
        cy.wait(200)
        cy.get('#num-simulations').type('0')
        cy.get(':nth-child(8) > .lhs > .btn').click()
        cy.get('#confidence-level').invoke('val', 1).trigger('input');
        cy.get('#buildCI').click()
        cy.wait(100)
        cy.get('#confidence-level').invoke('val', 37).trigger('input');
        cy.get('#buildCI').click()
        cy.wait(100)
        cy.get('#confidence-level').invoke('val',100).trigger('input');
        cy.get('#buildCI').click()
        cy.wait(100)
      
      })              
})