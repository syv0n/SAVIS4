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

    describe('Export Functionality', () => {
        beforeEach(() => {
            cy.get('#dataPoints').type('1,3{enter}2,5{enter}3,7{enter}4,9{enter}5,11')
            cy.get('button.btn').contains(/update chart|lr_update_chart/i).click()
            cy.get('app-scatter-plot canvas').should('be.visible')
            cy.wait(500)
        })

        it('should display export buttons when chart is loaded', () => {
            cy.get('#export-pdf-btn').should('be.visible')
            cy.get('#export-docx-btn').should('be.visible')
        })

        it('should disable export buttons when no data is available', () => {
            cy.get('#dataPoints').clear()
            cy.get('button.btn').contains(/update chart|lr_update_chart/i).click()
            cy.get('#export-pdf-btn').should('be.disabled')
            cy.get('#export-docx-btn').should('be.disabled')
        })

        it('should export PDF successfully', () => {
            cy.get('#export-pdf-btn').click()
            cy.task('checkFileExists', 'cypress/downloads/linear-regression-export.pdf')
        })

        it('should export DOCX successfully', () => {
            cy.get('#export-docx-btn').click()
            cy.task('checkFileExists', 'cypress/downloads/linear-regression-export.docx')
        })

        it('should export with different data sets', () => {
            cy.get('#dataPoints').clear()
            cy.get('#dataPoints').type('2,4{enter}4,8{enter}6,12{enter}8,16')
            cy.get('button.btn').contains(/update chart|lr_update_chart/i).click()
            cy.wait(500)
            
            cy.get('#export-pdf-btn').click()
            cy.task('checkFileExists', 'cypress/downloads/linear-regression-export.pdf')
        })
    })

    describe('Regression Problems Page', () => {
        beforeEach(() => {
            cy.visit('localhost:4200/problems-regression')
            cy.viewport(1920, 1080)
            cy.wait(500)
        })

        describe('Navigation Tests', () => {
            it('should navigate to regression problems page successfully', () => {
                cy.url().should('include', '/problems-regression')
                cy.get('h1').should('be.visible')
                cy.get('.green-box').should('be.visible')
                cy.get('.data-table').should('be.visible')
                cy.get('canvas').should('be.visible')
            })

            it('should have a back button that navigates to problems page', () => {
                cy.get('.back-button').should('be.visible')
                cy.get('.back-button').click()
                cy.url().should('include', '/problems')
            })

            it('should display all necessary UI elements', () => {
                cy.get('.textbox').should('be.visible')
                cy.get('.submit-button').contains('Submit Answer').should('be.visible')
                cy.get('.submit-button').contains('New Problem').should('be.visible')
                cy.get('.data-table thead th').should('have.length', 2)
            })
        })

        describe('Answer Validation Tests', () => {
            it('should mark correct answer as correct', () => {
                cy.window().then((win) => {
                    const component = (win as any).ng.getComponent(cy.$$('app-user-manual')[0])
                    const correctAnswer = component.correctAnswer
                    
                    cy.get('.textbox').clear().type(correctAnswer)
                    cy.get('.submit-button').contains('Submit Answer').click()
                    
                    cy.get('.answer-box').should('have.class', 'correct')
                    cy.get('.answer-box').should('contain', 'Correct!')
                    cy.get('.solution-button').should('not.exist')
                })
            })

            it('should mark incorrect answer as incorrect', () => {
                cy.get('.textbox').clear().type('999.99')
                cy.get('.submit-button').contains('Submit Answer').click()
                
                cy.get('.answer-box').should('have.class', 'incorrect')
                cy.get('.answer-box').should('contain', 'Incorrect answer')
                cy.get('.answer-box').should('contain', 'Correct answer:')
            })

            it('should display correct answer when user is wrong', () => {
                cy.get('.textbox').clear().type('999.99')
                cy.get('.submit-button').contains('Submit Answer').click()
                
                cy.get('.answer-box').within(() => {
                    cy.contains('Correct answer:').should('be.visible')
                    cy.get('p').eq(1).should('not.be.empty')
                })
            })

            it('should hide answer when hide button is clicked', () => {
                cy.get('.textbox').clear().type('999.99')
                cy.get('.submit-button').contains('Submit Answer').click()
                
                cy.get('.answer-box').should('be.visible')
                cy.get('.hide-button').click()
                cy.get('.answer-box').should('not.exist')
            })

            it('should allow tolerance for numerical answers', () => {
                cy.window().then((win) => {
                    const component = (win as any).ng.getComponent(cy.$$('app-user-manual')[0])
                    const correctAnswer = parseFloat(component.correctAnswer)
                    
                    if (!isNaN(correctAnswer)) {
                        const closeAnswer = (correctAnswer + 0.01).toFixed(2)
                        cy.get('.textbox').clear().type(closeAnswer)
                        cy.get('.submit-button').contains('Submit Answer').click()
                        
                        cy.get('.answer-box').should('have.class', 'correct')
                    }
                })
            })

            it('should handle equation format answers correctly', () => {
                cy.window().then((win) => {
                    const component = (win as any).ng.getComponent(cy.$$('app-user-manual')[0])
                    
                    const checkAndGenerate = () => {
                        cy.window().then((w) => {
                            const comp = (w as any).ng.getComponent(cy.$$('app-user-manual')[0])
                            if (comp.currentProblem === 'equation') {
                                const correctAnswer = comp.correctAnswer
                                
                                const answerWithSpaces = correctAnswer.replace(/([+-])/g, ' $1 ')
                                cy.get('.textbox').clear().type(answerWithSpaces)
                                cy.get('.submit-button').contains('Submit Answer').click()
                                cy.get('.answer-box').should('have.class', 'correct')
                            } else {
                                cy.get('.submit-button').contains('New Problem').click()
                                cy.wait(500)
                                checkAndGenerate()
                            }
                        })
                    }
                    
                    checkAndGenerate()
                })
            })
        })

        describe('Solution Modal Tests', () => {
            beforeEach(() => {
                cy.get('.textbox').clear().type('999.99')
                cy.get('.submit-button').contains('Submit Answer').click()
                cy.wait(300)
            })

            it('should display solution button when answer is incorrect', () => {
                cy.get('.solution-button').should('be.visible')
                cy.get('.solution-button').should('contain', 'Show Step-by-Step Solution')
            })

            it('should not display solution button when answer is correct', () => {
                cy.window().then((win) => {
                    const component = (win as any).ng.getComponent(cy.$$('app-user-manual')[0])
                    const correctAnswer = component.correctAnswer
                    
                    cy.get('.hide-button').click()
                    cy.get('.textbox').clear().type(correctAnswer)
                    cy.get('.submit-button').contains('Submit Answer').click()
                    
                    cy.get('.solution-button').should('not.exist')
                })
            })

            it('should open solution modal when button is clicked', () => {
                cy.get('.solution-button').click()
                cy.wait(300)
                
                cy.get('.modal-overlay').should('be.visible')
                cy.get('.modal-content').should('be.visible')
                cy.get('.modal-header h2').should('contain', 'Step-by-Step Solution')
            })

            it('should close modal when close button is clicked', () => {
                cy.get('.solution-button').click()
                cy.get('.modal-overlay').should('be.visible')
                
                cy.get('.close-button').click()
                cy.wait(300)
                
                cy.get('.modal-overlay').should('not.exist')
            })

            it('should close modal when clicking outside', () => {
                cy.get('.solution-button').click()
                cy.get('.modal-overlay').should('be.visible')
                
                cy.get('.modal-overlay').click('topLeft')
                cy.wait(300)
                
                cy.get('.modal-overlay').should('not.exist')
            })

            it('should close modal when footer close button is clicked', () => {
                cy.get('.solution-button').click()
                cy.get('.modal-overlay').should('be.visible')
                
                cy.get('.close-modal-button').click()
                cy.wait(300)
                
                cy.get('.modal-overlay').should('not.exist')
            })

            it('should display solution steps in modal', () => {
                cy.get('.solution-button').click()
                
                cy.get('.modal-body').should('be.visible')
                cy.get('.solution-step').should('have.length.greaterThan', 0)
                cy.get('.solution-step').first().should('contain', 'Step')
            })

            it('should not close modal when clicking inside modal content', () => {
                cy.get('.solution-button').click()
                cy.get('.modal-overlay').should('be.visible')
                
                cy.get('.modal-content').click()
                cy.wait(300)
                
                cy.get('.modal-overlay').should('be.visible')
            })
        })

        describe('Calculation Accuracy Tests', () => {
            it('should calculate slope correctly for simple linear data', () => {
                cy.window().then((win) => {
                    const component = (win as any).ng.getComponent(cy.$$('app-user-manual')[0])
                    
                    component.dataPoints = [
                        { x: 1, y: 3 },
                        { x: 2, y: 5 },
                        { x: 3, y: 7 },
                        { x: 4, y: 9 },
                        { x: 5, y: 11 }
                    ]
                    
                    const regression = component.calculateRegression(component.dataPoints)
                    
                    expect(regression.slope).to.be.closeTo(2.00, 0.01)
                    expect(regression.intercept).to.be.closeTo(1.00, 0.01)
                })
            })

            it('should verify correct answer matches calculated value', () => {
                cy.window().then((win) => {
                    const component = (win as any).ng.getComponent(cy.$$('app-user-manual')[0])
                    
                    const regression = component.regression
                    const problemType = component.currentProblem
                    
                    let expectedAnswer
                    switch (problemType) {
                        case 'slope':
                            expectedAnswer = regression.slope.toFixed(2)
                            break
                        case 'intercept':
                            expectedAnswer = regression.intercept.toFixed(2)
                            break
                        case 'equation':
                            expectedAnswer = `y = ${regression.slope.toFixed(2)}x + ${regression.intercept.toFixed(2)}`
                            break
                        case 'predict_y':
                            expectedAnswer = (regression.slope * component.predictXValue + regression.intercept).toFixed(2)
                            break
                    }
                    
                    if (expectedAnswer) {
                        expect(component.correctAnswer.toLowerCase()).to.equal(expectedAnswer.toLowerCase())
                    }
                })
            })

            it('should calculate Sum of Squared Residuals correctly', () => {
                const findSSRProblem = () => {
                    cy.window().then((win) => {
                        const component = (win as any).ng.getComponent(cy.$$('app-user-manual')[0])
                        
                        if (component.currentProblem === 'ssr') {
                            const regression = component.regression
                            const dataPoints = component.dataPoints
                            
                            let manualSSR = 0
                            dataPoints.forEach((point: any) => {
                                const predictedY = regression.slope * point.x + regression.intercept
                                const residual = point.y - predictedY
                                manualSSR += residual * residual
                            })
                            
                            const componentSSR = parseFloat(component.correctAnswer)
                            expect(componentSSR).to.be.closeTo(manualSSR, 0.1)
                        } else {
                            cy.get('.submit-button').contains('New Problem').click()
                            cy.wait(500)
                            findSSRProblem()
                        }
                    })
                }
                
                findSSRProblem()
            })

            it('should display correct data points in table', () => {
                cy.window().then((win) => {
                    const component = (win as any).ng.getComponent(cy.$$('app-user-manual')[0])
                    const dataPoints = component.dataPoints
                    
                    cy.get('.data-table tbody tr').should('have.length', dataPoints.length)
                    
                    dataPoints.forEach((point: any, index: number) => {
                        cy.get('.data-table tbody tr').eq(index).within(() => {
                            cy.get('td').eq(0).should('contain', point.x)
                            cy.get('td').eq(1).should('contain', point.y)
                        })
                    })
                })
            })
        })

        describe('New Problem Generation Tests', () => {
            it('should generate new problem when button is clicked', () => {
                cy.get('.green-box p').invoke('text').then((initialProblem) => {
                    cy.get('.submit-button').contains('New Problem').click()
                    cy.wait(500)
                    
                    cy.get('.green-box p').invoke('text').should((newProblem) => {
                        expect(newProblem).to.be.a('string')
                    })
                })
            })

            it('should reset answer fields when new problem is generated', () => {
                cy.get('.textbox').clear().type('999.99')
                cy.get('.submit-button').contains('Submit Answer').click()
                cy.get('.answer-box').should('be.visible')
                
                cy.get('.submit-button').contains('New Problem').click()
                cy.wait(500)
                
                cy.get('.textbox').should('have.value', '')
                cy.get('.answer-box').should('not.exist')
            })

            it('should generate data points within expected range', () => {
                cy.window().then((win) => {
                    const component = (win as any).ng.getComponent(cy.$$('app-user-manual')[0])
                    
                    component.dataPoints.forEach((point: any) => {
                        expect(point.x).to.equal(Math.round(point.x))
                        expect(point.y).to.equal(Math.round(point.y))
                    })
                    
                    expect(component.dataPoints.length).to.be.at.least(5)
                    expect(component.dataPoints.length).to.be.at.most(10)
                })
            })

            it('should update chart when new problem is generated', () => {
                cy.get('canvas').should('be.visible')
                
                cy.get('.submit-button').contains('New Problem').click()
                cy.wait(500)
                
                cy.get('canvas').should('be.visible')
            })
        })

        describe('Different Problem Types Tests', () => {
            it('should handle all problem types', () => {
                const foundTypes = new Set()
                
                const checkProblemType = (attempts = 0) => {
                    if (attempts >= 20 || foundTypes.size >= 3) {
                        expect(foundTypes.size).to.be.at.least(2)
                        return
                    }
                    
                    cy.window().then((win) => {
                        const component = (win as any).ng.getComponent(cy.$$('app-user-manual')[0])
                        foundTypes.add(component.currentProblem)
                        
                        cy.get('.submit-button').contains('New Problem').click()
                        cy.wait(500)
                        checkProblemType(attempts + 1)
                    })
                }
                
                checkProblemType()
            })
        })
    })
})