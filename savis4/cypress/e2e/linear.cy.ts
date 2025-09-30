describe('template spec', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/LR')
    })
    
    it('should load the page successfully', () => {
        cy.get('h1').should('be.visible')
        cy.get('#dataPoints').should('be.visible')
        cy.get('button.btn').should('be.visible')
    })
    
    it('should input data points and load the chart', () => {
        cy.get('#dataPoints').type('1,3 \n 2,5 \n 3,7 \n 4,9 \n 5,11')
        cy.get('button.btn').first().click()
        cy.get('app-scatter-plot').should('be.visible')
    })
    
    it('should click the choose file button', () => {
        cy.get('.file-input .btn').click()
    })

    describe('Chart Legend Filters', () => {
        beforeEach(() => {
            cy.get('#dataPoints').type('1,3{enter}2,5{enter}3,7{enter}4,9{enter}5,11')
            cy.get('button.btn').contains(/update chart|lr_update_chart/i).click()
            cy.get('app-scatter-plot canvas').should('be.visible')
            cy.wait(500)
        })

        it('should toggle Scatter Plot by clicking legend', () => {
            cy.get('app-scatter-plot canvas').click(150, 20, { force: true })
            cy.wait(300)

            cy.get('app-scatter-plot canvas').click(150, 20, { force: true })
            cy.wait(300)
        })

        it('should toggle Regression Line by clicking legend', () => {
            cy.get('app-scatter-plot canvas').click(300, 20, { force: true })
            cy.wait(300)
            cy.get('app-scatter-plot canvas').click(300, 20, { force: true })
            cy.wait(300)
        })

        it('should toggle Upper Bound by clicking legend', () => {
            cy.get('app-scatter-plot canvas').click(425, 20, { force: true })
            cy.wait(300)
            cy.get('app-scatter-plot canvas').click(425, 20, { force: true })
            cy.wait(300)
        })

        it('should toggle Lower Bound by clicking legend', () => {
            cy.get('app-scatter-plot canvas').click(550, 20, { force: true })
            cy.wait(300)
            cy.get('app-scatter-plot canvas').click(550, 20, { force: true })
            cy.wait(300)
        })

        it('should toggle Error Bars by clicking legend', () => {
            cy.get('app-scatter-plot canvas').click(650, 20, { force: true })
            cy.wait(300)
            cy.get('app-scatter-plot canvas').click(650, 20, { force: true })
            cy.wait(300)
        })

        it('should toggle Residual Squares by clicking legend', () => {
            cy.get('app-scatter-plot canvas').click(770, 20, { force: true })
            cy.wait(300)
            cy.get('app-scatter-plot canvas').click(770, 20, { force: true })
            cy.wait(300)
        })

        it('should toggle multiple filters', () => {
            cy.get('app-scatter-plot canvas').click(150, 20, { force: true })
            cy.wait(200)
            
            cy.get('app-scatter-plot canvas').click(425, 20, { force: true })
            cy.wait(200)
            
            cy.get('app-scatter-plot canvas').click(650, 20, { force: true })
            cy.wait(200)
            
            cy.get('app-scatter-plot canvas').should('be.visible')
            
            cy.get('app-scatter-plot canvas').click(150, 20, { force: true })
            cy.get('app-scatter-plot canvas').click(425, 20, { force: true })
            cy.get('app-scatter-plot canvas').click(650, 20, { force: true })
        })

        it('should disable all filters by clicking legends', () => {
            const legendPositions = [150, 300, 425, 550, 650, 770]
            
            legendPositions.forEach(xPos => {
                cy.get('app-scatter-plot canvas').click(xPos, 20, { force: true })
                cy.wait(100)
            })
            
            cy.wait(300)
            cy.get('app-scatter-plot canvas').should('be.visible')

            legendPositions.forEach(xPos => {
                cy.get('app-scatter-plot canvas').click(xPos, 20, { force: true })
                cy.wait(100)
            })
        })

        it('should test filter combinations - regression with bounds', () => {
            cy.get('app-scatter-plot canvas').click(150, 20, { force: true }) 
            cy.get('app-scatter-plot canvas').click(650, 20, { force: true }) 
            cy.get('app-scatter-plot canvas').click(770, 20, { force: true }) 
            
            cy.wait(300)
            cy.get('app-scatter-plot canvas').should('be.visible')
            cy.get('.regression-formula-value').should('be.visible')
        })

        it('should test filter combinations - scatter with error bars', () => {
            cy.get('app-scatter-plot canvas').click(300, 20, { force: true })
            cy.get('app-scatter-plot canvas').click(425, 20, { force: true })
            cy.get('app-scatter-plot canvas').click(550, 20, { force: true })
            cy.get('app-scatter-plot canvas').click(770, 20, { force: true })
            
            cy.wait(300)
            cy.get('app-scatter-plot canvas').should('be.visible')
        })

        it('should update chart when new data is added', () => {
            cy.get('.regression-formula-value').invoke('text').then((initialFormula) => {
                cy.get('#dataPoints').clear()
                cy.get('#dataPoints').type('2,4{enter}4,8{enter}6,12{enter}8,16')
                cy.get('button.btn').contains(/update chart|lr_update_chart/i).click()

                cy.get('.regression-formula-value').invoke('text').should((newFormula) => {
                    expect(newFormula).to.not.equal(initialFormula)
                })
            })
        })

        it('should test with different data patterns', () => {
            cy.get('#dataPoints').clear()
            cy.get('#dataPoints').type('1,2{enter}2,4{enter}3,9{enter}4,16{enter}5,25')
            cy.get('button.btn').contains(/update chart|lr_update_chart/i).click()

            cy.get('.least-squares-value').should('be.visible')
            cy.get('.least-squares-value').invoke('text').then((text) => {
                const value = parseFloat(text)
                expect(value).to.be.greaterThan(0)
            })
        })

        it('should handle negative values', () => {
            cy.get('#dataPoints').clear()
            cy.get('#dataPoints').type('-5,-10{enter}-3,-6{enter}-1,-2{enter}1,2{enter}3,6')
            cy.get('button.btn').contains(/update chart|lr_update_chart/i).click()
            
            cy.get('app-scatter-plot canvas').should('be.visible')
            cy.get('.regression-formula-value').should('contain', 'y =')
        })

        it('should calculate correct statistics for minimum data points', () => {
            cy.get('#dataPoints').clear()
            cy.get('#dataPoints').type('1,2{enter}3,6')
            cy.get('button.btn').contains(/update chart|lr_update_chart/i).click()
            
            cy.get('.regression-formula-value').should('contain', 'y =')
            cy.get('.least-squares-value').should('be.visible')
        })

        it('should handle decimal values', () => {
            cy.get('#dataPoints').clear()
            cy.get('#dataPoints').type('1.5,3.2{enter}2.7,5.4{enter}3.9,7.8{enter}4.2,8.4')
            cy.get('button.btn').contains(/update chart|lr_update_chart/i).click()
            
            cy.get('app-scatter-plot canvas').should('be.visible')
            cy.get('.regression-formula-value').should('contain', 'y =')
        })

        it('should update least squares when data changes', () => {
            cy.get('.least-squares-value').invoke('text').then((initialLS) => {

                cy.get('#dataPoints').clear()
                cy.get('#dataPoints').type('1,5{enter}2,7{enter}3,4{enter}4,10{enter}5,8')
                cy.get('button.btn').contains(/update chart|lr_update_chart/i).click()

                cy.get('.least-squares-value').invoke('text').should((newLS) => {
                    expect(newLS).to.not.equal(initialLS)
                })
            })
        })
    })

    /* used to find the legend coordinates
    it('should help find legend coordinates', () => {
            // Try different x positions to see which legends get clicked
            const testPositions = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000]
            
            testPositions.forEach((xPos, index) => {
                cy.get('app-scatter-plot canvas').click(xPos, 20, { force: true })
                cy.wait(500)
                cy.screenshot(`legend-click-x${xPos}-step${index}`)
            })
        })
    */

    describe('Complete Workflow Tests', () => {
        it('should complete full data entry, visualization, and analysis workflow', () => {
            cy.get('#dataPoints').type('1,3{enter}2,5{enter}3,7{enter}4,9{enter}5,11')
            
            cy.get('button.btn').contains(/update chart|lr_update_chart/i).click()
            
            cy.get('app-scatter-plot canvas').should('be.visible')
            cy.get('.least-squares-badge').should('be.visible')
            cy.get('.regression-formula').should('be.visible')
            
            cy.get('.regression-formula-value').should('contain', 'y = 2.00x')
            cy.get('.least-squares-value').should('be.visible')
            
            const csvContent = '10,20\n15,30\n20,40'
            cy.get('.file-input input[type="file"]').selectFile({
                contents: Cypress.Buffer.from(csvContent),
                fileName: 'new-data.csv',
                mimeType: 'text/csv'
            }, { force: true })
            
            cy.get('button.btn').contains(/update chart|lr_update_chart/i).click()
            cy.get('.regression-formula-value').should('be.visible')
        })
    })
})
