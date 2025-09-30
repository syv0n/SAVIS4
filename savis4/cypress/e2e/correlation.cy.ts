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

      // Chart Legend Filter Tests
    describe('Chart Legend Filters', () => {
        beforeEach(() => {
            cy.get('#columnX').type('1,2,3,4,5')
            cy.get('#columnY').type('2,4,6,8,10')
            cy.contains('button', /update chart|correlation_update_chart/i).click()
            cy.wait(500)
        })

        it('should display chart legend items', () => {
            cy.get('#data-chart-1').should('be.visible')
        })

        it('should toggle Correlation Values (scatter plot) by clicking legend', () => {
            cy.get('#data-chart-1').click(700, 20, { force: true })
            cy.wait(300)
            cy.get('#data-chart-1').click(700, 20, { force: true })
            cy.wait(300)
        })

        it('should toggle Regression Line by clicking legend', () => {
            cy.get('#data-chart-1').click(850, 20, { force: true })
            cy.wait(300)
            cy.get('#data-chart-1').click(850, 20, { force: true })
            cy.wait(300)
        })

        it('should toggle Line Controls by clicking legend', () => {
            cy.get('#data-chart-1').click(1000, 20, { force: true })
            cy.wait(300)
            cy.get('#data-chart-1').click(1000, 20, { force: true })
            cy.wait(300)
        })

        it('should test multiple legend toggles', () => {
            cy.get('#data-chart-1').click(700, 20, { force: true })
            cy.wait(200)
            cy.get('#data-chart-1').click(850, 20, { force: true })
            cy.wait(300)
            cy.get('#data-chart-1').should('be.visible')
        })
        /*
        it('should find legend coordinates helper test', () => {
            const testPositions = [100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 700, 800, 900, 1000, 1100, 1200]
            
            testPositions.forEach((xPos, index) => {
                cy.get('#data-chart-1').click(xPos, 20, { force: true })
                cy.wait(500)
                cy.screenshot(`correlation-legend-x${xPos}-step${index}`)
            })
        })
        */
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
