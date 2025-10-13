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

    describe('Export Functionality', () => {
        it('should display export buttons when workflow is completed', () => {
            // Complete the full workflow
            cy.get('#a-success').clear()
            cy.get('#a-success').type('5')
            cy.get('#a-failure').clear()
            cy.get('#a-failure').type('1')
            cy.get('#b-success').clear()
            cy.get('#b-success').type('15')
            cy.get('#b-failure').clear()
            cy.get('#b-failure').type('8')
            cy.get('#input-section > .lhs > .btn').click()
            
            cy.get('#num-simulations').clear()
            cy.get('#num-simulations').type('100')
            cy.get(':nth-child(8) > .lhs > .btn').click()
            
            cy.get('#buildCI').click()

            // Export buttons should be visible and enabled
            cy.get('#export-pdf-btn').should('be.visible').and('not.be.disabled')
            cy.get('#export-docx-btn').should('be.visible').and('not.be.disabled')
        })

        it('should disable export buttons when no data is available', () => {
            // Export buttons should be disabled initially
            cy.get('#export-pdf-btn').should('be.disabled')
            cy.get('#export-docx-btn').should('be.disabled')
        })

        it('should disable export buttons after only loading data', () => {
            // Load data but don't run simulations
            cy.get('#a-success').clear()
            cy.get('#a-success').type('5')
            cy.get('#a-failure').clear()
            cy.get('#a-failure').type('1')
            cy.get('#b-success').clear()
            cy.get('#b-success').type('15')
            cy.get('#b-failure').clear()
            cy.get('#b-failure').type('8')
            cy.get('#input-section > .lhs > .btn').click()

            // Export buttons should still be disabled
            cy.get('#export-pdf-btn').should('be.disabled')
            cy.get('#export-docx-btn').should('be.disabled')
        })

        it('should export PDF successfully', () => {
            // Complete the full workflow
            cy.get('#a-success').clear()
            cy.get('#a-success').type('5')
            cy.get('#a-failure').clear()
            cy.get('#a-failure').type('1')
            cy.get('#b-success').clear()
            cy.get('#b-success').type('15')
            cy.get('#b-failure').clear()
            cy.get('#b-failure').type('8')
            cy.get('#input-section > .lhs > .btn').click()
            
            cy.get('#num-simulations').clear()
            cy.get('#num-simulations').type('100')
            cy.get(':nth-child(8) > .lhs > .btn').click()
            
            cy.get('#buildCI').click()

            // Click export PDF button and verify it doesn't throw errors
            cy.get('#export-pdf-btn').should('not.be.disabled')
            cy.get('#export-pdf-btn').click()
            
            // Wait for export process to complete
            cy.wait(2000)
            
            // Verify button is still functional (not disabled after click)
            cy.get('#export-pdf-btn').should('not.be.disabled')
        })

        it('should export DOCX successfully', () => {
            // Complete the full workflow
            cy.get('#a-success').clear()
            cy.get('#a-success').type('5')
            cy.get('#a-failure').clear()
            cy.get('#a-failure').type('1')
            cy.get('#b-success').clear()
            cy.get('#b-success').type('15')
            cy.get('#b-failure').clear()
            cy.get('#b-failure').type('8')
            cy.get('#input-section > .lhs > .btn').click()
            
            cy.get('#num-simulations').clear()
            cy.get('#num-simulations').type('100')
            cy.get(':nth-child(8) > .lhs > .btn').click()
            
            cy.get('#buildCI').click()

            // Click export DOCX button and verify it doesn't throw errors
            cy.get('#export-docx-btn').should('not.be.disabled')
            cy.get('#export-docx-btn').click()
            
            // Wait for export process to complete
            cy.wait(2000)
            
            // Verify button is still functional (not disabled after click)
            cy.get('#export-docx-btn').should('not.be.disabled')
        })

        it('should export with different data sets', () => {
            // Test with different data
            cy.get('#a-success').clear()
            cy.get('#a-success').type('10')
            cy.get('#a-failure').clear()
            cy.get('#a-failure').type('5')
            cy.get('#b-success').clear()
            cy.get('#b-success').type('20')
            cy.get('#b-failure').clear()
            cy.get('#b-failure').type('10')
            cy.get('#input-section > .lhs > .btn').click()
            
            cy.get('#num-simulations').clear()
            cy.get('#num-simulations').type('200')
            cy.get(':nth-child(8) > .lhs > .btn').click()
            
            cy.get('#buildCI').click()

            // Export should work with different data
            cy.get('#export-pdf-btn').should('not.be.disabled')
            cy.get('#export-docx-btn').should('not.be.disabled')

            // Test PDF export with different data
            cy.get('#export-pdf-btn').click()
            cy.wait(2000)
            cy.get('#export-pdf-btn').should('not.be.disabled')
            
            // Test DOCX export with different data
            cy.get('#export-docx-btn').click()
            cy.wait(2000)
            cy.get('#export-docx-btn').should('not.be.disabled')
        })
    })
})