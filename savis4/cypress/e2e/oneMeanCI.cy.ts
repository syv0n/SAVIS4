describe('template spec', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/onemeanCI')
    })
    it('passes', () => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/onemeanCI')
    })

    it ('should select and load sample 1', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(250)
        cy.get('#load-data-btn').click()
    })
    it ('should select and load sample 2', () => {
        cy.get('#sample-data-options').select("Example 2")
        cy.wait(250)
        cy.get('#load-data-btn').click()
    })
    it ('should select the file upload button', () => {
        cy.get('#upload-btn').click()
    })
    it('should input a number in the sample size box', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(250)
        cy.get('#load-data-btn').click()
        cy.get('#sample-data-size').clear()
        cy.get('#sample-data-size').type('5')
        cy.get('#get-sample-btn').click()
        cy.wait(250)
        cy.get('#get-sample-btn').click()
        cy.wait(250)
        cy.get('#get-sample-btn').click()
        cy.wait(250)
    })
    it('should input a number in the number of simulation box', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(250)
        cy.get('#load-data-btn').click()
        cy.get('#no-of-sample').clear()
        cy.get('#no-of-sample').type('5')
        cy.get('#get-sample-btn').click()
        cy.wait(250)
        cy.get('#get-sample-btn').click()
        cy.wait(250)
        cy.get('#get-sample-btn').click()
        cy.wait(250)
    })
    it('should increase and decrease the MIN value', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(250)
        cy.get('#load-data-btn').click()
        cy.get('#no-of-sample').clear()
        cy.get('#no-of-sample').type('5')
        cy.get('#get-sample-btn').click()
        cy.get('#min-interValue').type('{uparrow}')
        cy.wait(200)
        cy.get('#min-interValue').type('{uparrow}')
        cy.wait(200)
        cy.get('#min-interValue').type('{uparrow}')
        cy.wait(200)
        cy.get('#min-interValue').type('{downarrow}')
        cy.wait(200)
        cy.get('#min-interValue').type('{downarrow}')
        cy.wait(200)
    })
    it('should increase and decrease the MIN value', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(250)
        cy.get('#load-data-btn').click()
        cy.get('#no-of-sample').clear()
        cy.get('#no-of-sample').type('5')
        cy.get('#get-sample-btn').click()
        cy.get('#max-interValue').type('{uparrow}')
        cy.wait(200)
        cy.get('#max-interValue').type('{uparrow}')
        cy.wait(200)
        cy.get('#max-interValue').type('{uparrow}')
        cy.wait(200)
        cy.get('#max-interValue').type('{downarrow}')
        cy.wait(200)
        cy.get('#max-interValue').type('{downarrow}')
        cy.wait(200)
    })
    it('should check the "include min" box', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(250)
        cy.get('#load-data-btn').click()
        cy.get('#no-of-sample').clear()
        cy.get('#no-of-sample').type('5')
        cy.get('#get-sample-btn').click()
        cy.get('#includeMin').click()
    })
    it('should check the "include max" box', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(250)
        cy.get('#load-data-btn').click()
        cy.get('#no-of-sample').clear()
        cy.get('#no-of-sample').type('5')
        cy.get('#get-sample-btn').click()
        cy.get('#includeMax').click()
    })
    it('should build interval with different inputs', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(250)
        cy.get('#load-data-btn').click()
        cy.get('#no-of-sample').clear()
        cy.get('#no-of-sample').type('5')
        cy.get('#get-sample-btn').click()
        cy.get('#interval-number').type('{uparrow}')
        cy.wait(200)
        cy.get('#bld-interval').click()
        cy.get('#interval-number').clear()
        cy.get('#interval-number').type('5')
        cy.wait(200)
        cy.get('#bld-interval').click()
        cy.get('#interval-number').type('5')
        cy.wait(200)
        cy.get('#bld-interval').click()
        
        
        
    })
    it('should reset data', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(250)
        cy.get('#load-data-btn').click()
        cy.get('#no-of-sample').clear()
        cy.get('#no-of-sample').type('5')
        cy.get('#get-sample-btn').click()
        cy.get('#interval-number').type('{uparrow}')
        cy.wait(200)
        cy.get('#bld-interval').click()
        cy.get('#reset-btn').click()
        cy.wait(1000)
      
        
        
        
    })

    describe('Export Functionality', () => {
        it('should display export buttons when workflow is completed', () => {
            // Complete the full workflow
            cy.get('#sample-data-options').select("Example 1")
            cy.wait(250)
            cy.get('#load-data-btn').click()
            
            cy.get('#no-of-sample').clear()
            cy.get('#no-of-sample').type('5')
            cy.get('#get-sample-btn').click()
            
            cy.get('#interval-number').clear()
            cy.get('#interval-number').type('3')
            cy.get('#bld-interval').click()

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
            cy.get('#sample-data-options').select("Example 1")
            cy.wait(250)
            cy.get('#load-data-btn').click()

            // Export buttons should still be disabled
            cy.get('#export-pdf-btn').should('be.disabled')
            cy.get('#export-docx-btn').should('be.disabled')
        })

        it('should disable export buttons after only running simulations', () => {
            // Load data and run simulations but don't build intervals
            cy.get('#sample-data-options').select("Example 1")
            cy.wait(250)
            cy.get('#load-data-btn').click()
            
            cy.get('#no-of-sample').clear()
            cy.get('#no-of-sample').type('5')
            cy.get('#get-sample-btn').click()

            // Export buttons should still be disabled
            cy.get('#export-pdf-btn').should('be.disabled')
            cy.get('#export-docx-btn').should('be.disabled')
        })

        it('should export PDF successfully', () => {
            // Complete the full workflow
            cy.get('#sample-data-options').select("Example 1")
            cy.wait(250)
            cy.get('#load-data-btn').click()
            
            cy.get('#no-of-sample').clear()
            cy.get('#no-of-sample').type('5')
            cy.get('#get-sample-btn').click()
            
            cy.get('#interval-number').clear()
            cy.get('#interval-number').type('3')
            cy.get('#bld-interval').click()

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
            cy.get('#sample-data-options').select("Example 1")
            cy.wait(250)
            cy.get('#load-data-btn').click()
            
            cy.get('#no-of-sample').clear()
            cy.get('#no-of-sample').type('5')
            cy.get('#get-sample-btn').click()
            
            cy.get('#interval-number').clear()
            cy.get('#interval-number').type('3')
            cy.get('#bld-interval').click()

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
            cy.get('#sample-data-options').select("Example 2")
            cy.wait(250)
            cy.get('#load-data-btn').click()
            
            cy.get('#no-of-sample').clear()
            cy.get('#no-of-sample').type('10')
            cy.get('#get-sample-btn').click()
            
            cy.get('#interval-number').clear()
            cy.get('#interval-number').type('5')
            cy.get('#bld-interval').click()

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