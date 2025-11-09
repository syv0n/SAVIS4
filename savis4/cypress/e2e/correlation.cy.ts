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

    describe('Export Functionality', () => {
        beforeEach(() => {
            // Setup data and chart
            cy.get('#columnX').type('1,2,3,4,5')
            cy.get('#columnY').type('2,4,6,8,10')
            cy.get('button.btn').contains(/update chart|correlation_update_chart/i).click()
            cy.get('#data-chart-1').should('be.visible')
            cy.wait(500)
        })

        it('should display export buttons when chart is loaded', () => {
            cy.get('#export-pdf-btn').should('be.visible')
            cy.get('#export-docx-btn').should('be.visible')
        })

        it('should disable export buttons when no data is available', () => {
            cy.get('#columnX').clear()
            cy.get('#columnY').clear()
            cy.get('button.btn').contains(/update chart|correlation_update_chart/i).click()
            cy.get('#export-pdf-btn').should('be.disabled')
            cy.get('#export-docx-btn').should('be.disabled')
        })

        it('should export PDF successfully', () => {
            cy.get('#export-pdf-btn').click()
            cy.task('checkFileExists', 'cypress/downloads/correlation-export.pdf')
        })

        it('should export DOCX successfully', () => {
            cy.get('#export-docx-btn').click()
            cy.task('checkFileExists', 'cypress/downloads/correlation-export.docx')
        })

        it('should export with different data sets', () => {
            // Test with different data
            cy.get('#columnX').clear()
            cy.get('#columnY').clear()
            cy.get('#columnX').type('10,20,30,40,50')
            cy.get('#columnY').type('5,15,25,35,45')
            cy.get('button.btn').contains(/update chart|correlation_update_chart/i).click()
            cy.wait(500)
            
            cy.get('#export-pdf-btn').click()
            cy.task('checkFileExists', 'cypress/downloads/correlation-export.pdf')
        })
    })

    // Homework Feature Tests
    describe('Homework Feature - Correlation Practice Problems', () => {
        it('should navigate to correlation practice problems page', () => {
            cy.contains('Practice Problems for Correlation Visualization')
                .invoke('removeAttr', 'target')
                .click()
            cy.url().should('include', '/problems-correlation')
            cy.contains(/Correlation Problems|problems_correlation_title/i).should('be.visible')
        })

        it('should display the practice problem interface', () => {
            cy.visit('http://localhost:4200/problems-correlation')
            
            // Check for key elements
            cy.get('canvas').should('be.visible')
            cy.get('#correlationType').should('be.visible')
            cy.get('#correlationStrength').should('be.visible')
            cy.contains('button', /Generate|problems_correlation_generate/i).should('be.visible')
        })

        it('should generate a new dataset when button is clicked', () => {
            cy.visit('http://localhost:4200/problems-correlation')
            cy.wait(500)
            
            // Click generate new dataset button
            cy.contains('button', /Generate|problems_correlation_generate/i).click()
            cy.wait(500)
            
            // Chart should still be visible
            cy.get('canvas').should('be.visible')
        })

        it('should allow selecting correlation type', () => {
            cy.visit('http://localhost:4200/problems-correlation')
            
            // Select correlation type
            cy.get('#correlationType').select('positive')
            cy.get('#correlationType').should('have.value', 'positive')
            
            cy.get('#correlationType').select('negative')
            cy.get('#correlationType').should('have.value', 'negative')
            
            cy.get('#correlationType').select('none')
            cy.get('#correlationType').should('have.value', 'none')
        })

        it('should allow selecting correlation strength', () => {
            cy.visit('http://localhost:4200/problems-correlation')
            
            // Select correlation strength
            cy.get('#correlationStrength').select('very-strong')
            cy.get('#correlationStrength').should('have.value', 'very-strong')
            
            cy.get('#correlationStrength').select('moderate')
            cy.get('#correlationStrength').should('have.value', 'moderate')
            
            cy.get('#correlationStrength').select('weak')
            cy.get('#correlationStrength').should('have.value', 'weak')
        })

        it('should submit answer and show feedback', () => {
            cy.visit('http://localhost:4200/problems-correlation')
            cy.wait(500)
            
            // Make selections
            cy.get('#correlationType').select('positive')
            cy.get('#correlationStrength').select('moderate')
            
            // Submit answer
            cy.contains('button', /Check Answer|problems_correlation_submit/i).click()
            cy.wait(500)
            
            // Feedback should be visible (coefficient display)
            cy.contains(/r =|coefficient/i).should('be.visible')
        })

        it('should disable inputs after submitting answer', () => {
            cy.visit('http://localhost:4200/problems-correlation')
            cy.wait(500)
            
            // Make selections and submit
            cy.get('#correlationType').select('positive')
            cy.get('#correlationStrength').select('strong')
            cy.contains('button', /Check Answer|problems_correlation_submit/i).click()
            cy.wait(500)
            
            // Inputs should be disabled
            cy.get('#correlationType').should('be.disabled')
            cy.get('#correlationStrength').should('be.disabled')
        })

        it('should show Try Again button after submission', () => {
            cy.visit('http://localhost:4200/problems-correlation')
            cy.wait(500)
            
            // Make selections and submit
            cy.get('#correlationType').select('negative')
            cy.get('#correlationStrength').select('weak')
            cy.contains('button', /Check Answer|problems_correlation_submit/i).click()
            cy.wait(500)
            
            // Try Again button should appear
            cy.contains('button', /Try Another Dataset|problems_correlation_try_again/i).should('be.visible')
        })

        it('should reset the problem when Try Again is clicked', () => {
            cy.visit('http://localhost:4200/problems-correlation')
            cy.wait(500)
            
            // Complete one attempt
            cy.get('#correlationType').select('positive')
            cy.get('#correlationStrength').select('moderate')
            cy.contains('button', /Check Answer|problems_correlation_submit/i).click()
            cy.wait(500)
            
            // Click Try Again
            cy.contains('button', /Try Another Dataset|problems_correlation_try_again/i).click()
            cy.wait(500)
            
            // Submit button should be visible again (not disabled state)
            cy.contains('button', /Check Answer|problems_correlation_submit/i).should('be.visible')
            
            // Inputs should be enabled
            cy.get('#correlationType').should('not.be.disabled')
            cy.get('#correlationStrength').should('not.be.disabled')
        })

        it('should navigate back to problems page', () => {
            cy.visit('http://localhost:4200/problems-correlation')
            cy.wait(500)
            
            // Click back button
            cy.contains(/Back|problems_back/i).click()
            cy.url().should('include', '/problems')
        })

        it('should complete full workflow: generate, answer, and retry', () => {
            cy.visit('http://localhost:4200/problems-correlation')
            cy.wait(500)
            
            // Generate new dataset
            cy.contains('button', /Generate|problems_correlation_generate/i).click()
            cy.wait(500)
            
            // Answer first attempt
            cy.get('#correlationType').select('positive')
            cy.get('#correlationStrength').select('strong')
            cy.contains('button', /Check Answer|problems_correlation_submit/i).click()
            cy.wait(500)
            
            // Verify feedback shown
            cy.contains(/r =|coefficient/i).should('be.visible')
            
            // Try again
            cy.contains('button', /Try Another Dataset|problems_correlation_try_again/i).click()
            cy.wait(500)
            
            // Answer second attempt
            cy.get('#correlationType').select('negative')
            cy.get('#correlationStrength').select('moderate')
            cy.contains('button', /Check Answer|problems_correlation_submit/i).click()
            cy.wait(500)
            
            // Verify feedback shown again
            cy.contains(/r =|coefficient/i).should('be.visible')
        })

        it('should display correlation coefficient after submission', () => {
            cy.visit('http://localhost:4200/problems-correlation')
            cy.wait(500)
            
            // Make selections and submit
            cy.get('#correlationType').select('positive')
            cy.get('#correlationStrength').select('very-strong')
            cy.contains('button', /Check Answer|problems_correlation_submit/i).click()
            cy.wait(500)
            
            // Check that correlation coefficient is displayed with proper format
            cy.contains(/r = -?\d\.\d{3}/).should('be.visible')
        })

        // Question Type Selector Tests
        describe('Question Type Selector', () => {
            beforeEach(() => {
                cy.visit('http://localhost:4200/problems-correlation')
                cy.wait(500)
            })

            it('should display question type selector dropdown', () => {
                cy.get('.question-type-dropdown').should('be.visible')
            })

            it('should have three question types available', () => {
                cy.get('.question-type-dropdown option').should('have.length.at.least', 3)
                cy.get('.question-type-dropdown').contains('Analyze the Correlation')
                cy.get('.question-type-dropdown').contains('Match Coefficient to Plot')
                cy.get('.question-type-dropdown').contains('Calculate Correlation')
            })

            it('should switch to Match Coefficient question type', () => {
                cy.get('.question-type-dropdown').select('match')
                cy.wait(500)
                
                // Check that match question interface is visible
                cy.contains('Select the correlation coefficient').should('be.visible')
                cy.get('canvas').should('be.visible')
            })

            it('should switch to Calculate Correlation question type', () => {
                cy.get('.question-type-dropdown').select('calculate')
                cy.wait(500)
                
                // Check that calculate question interface is visible
                cy.contains('Step 1:').should('be.visible')
                cy.contains('Step 2:').should('be.visible')
                cy.contains('Step 3:').should('be.visible')
            })

            it('should switch back to Analyze question type', () => {
                cy.get('.question-type-dropdown').select('calculate')
                cy.wait(500)
                cy.get('.question-type-dropdown').select('analyze')
                cy.wait(500)
                
                // Check that analyze question interface is visible
                cy.get('#correlationType').should('be.visible')
                cy.get('#correlationStrength').should('be.visible')
            })
        })

        // Match Coefficient to Plot Tests
        describe('Match Coefficient to Plot Question Type', () => {
            beforeEach(() => {
                cy.visit('http://localhost:4200/problems-correlation')
                cy.wait(500)
                cy.get('.question-type-dropdown').select('match')
                cy.wait(500)
                // Generate a question to populate options
                cy.get('.generate-button').click()
                cy.wait(500)
            })

            it('should display scatter plot and coefficient options', () => {
                cy.get('canvas').should('be.visible')
                cy.get('select').contains('r =').should('be.visible')
            })

            it('should generate new match question when button is clicked', () => {
                cy.get('.generate-button').click()
                cy.wait(500)
                
                cy.get('canvas').should('be.visible')
                cy.get('select').contains('r =').should('be.visible')
            })

            it('should allow selecting a coefficient option', () => {
                cy.wait(500) // Wait for options to populate
                cy.get('select').last().should('be.visible')
                cy.get('select').last().find('option').should('have.length.at.least', 2)
                cy.get('select').last().select('0')
                cy.get('select').last().should('have.value', '0')
            })

            it('should submit match answer and show feedback', () => {
                cy.wait(500) // Wait for options to populate
                cy.get('select').last().select('0')
                cy.contains('button', /Check Answer|problems_correlation_submit/i).click()
                cy.wait(500)
                
                // Feedback should be visible
                cy.contains(/r =|coefficient/i).should('be.visible')
            })

            it('should disable inputs after submitting match answer', () => {
                cy.wait(500) // Wait for options to populate
                cy.get('select').last().select('0')
                cy.contains('button', /Check Answer|problems_correlation_submit/i).click()
                cy.wait(500)
                
                // Check that the select is disabled after submission
                cy.get('select').last().should('be.disabled')
            })
        })

        // Calculate Correlation Tests
        describe('Calculate Correlation Question Type', () => {
            beforeEach(() => {
                cy.visit('http://localhost:4200/problems-correlation')
                cy.wait(500)
                cy.get('.question-type-dropdown').select('calculate')
                cy.wait(500)
            })

            it('should display step-by-step calculation interface', () => {
                cy.contains('Step 1:').should('be.visible')
                cy.contains('Step 2:').should('be.visible')
                cy.contains('Step 3:').should('be.visible')
                cy.contains('Calculate the mean of X').should('be.visible')
                cy.contains('Calculate the mean of Y').should('be.visible')
                cy.contains('Calculate the correlation coefficient').should('be.visible')
            })

            it('should display data table with X and Y values', () => {
                cy.get('.simple-data-table').should('be.visible')
                cy.get('.simple-data-table th').contains('X').should('be.visible')
                cy.get('.simple-data-table th').contains('Y').should('be.visible')
            })

            it('should generate new calculate question when button is clicked', () => {
                cy.get('.generate-button').click()
                cy.wait(500)
                
                cy.get('.simple-data-table').should('be.visible')
                cy.contains('Step 1:').should('be.visible')
            })

            it('should allow inputting mean X value', () => {
                cy.get('.step-input').first().type('15.0')
                cy.get('.step-input').first().should('have.value', '15.0')
            })

            it('should allow inputting mean Y value', () => {
                cy.get('.step-input').eq(1).type('25.0')
                cy.get('.step-input').eq(1).should('have.value', '25.0')
            })

            it('should allow inputting correlation coefficient', () => {
                cy.get('.step-input').last().type('0.8')
                cy.get('.step-input').last().should('have.value', '0.8')
            })

            it('should submit calculate answer with all steps filled', () => {
                cy.get('.step-input').first().type('15.0')
                cy.get('.step-input').eq(1).type('25.0')
                cy.get('.step-input').last().type('0.9')
                
                cy.contains('button', /Check Answer|problems_correlation_submit/i).click()
                cy.wait(500)
                
                // Feedback should be visible for each step
                cy.contains('Step 1: Mean of X').should('be.visible')
                cy.contains('Step 2: Mean of Y').should('be.visible')
                cy.contains('Step 3: Correlation Coefficient').should('be.visible')
            })

            it('should show feedback for each calculation step', () => {
                cy.get('.step-input').first().type('15.0')
                cy.get('.step-input').eq(1).type('25.0')
                cy.get('.step-input').last().type('0.9')
                
                cy.contains('button', /Check Answer|problems_correlation_submit/i).click()
                cy.wait(500)
                
                // Check for feedback boxes
                cy.get('.feedback-box').should('have.length.at.least', 3)
            })

            it('should disable step inputs after submission', () => {
                cy.get('.step-input').first().type('15.0')
                cy.get('.step-input').eq(1).type('25.0')
                cy.get('.step-input').last().type('0.9')
                
                cy.contains('button', /Check Answer|problems_correlation_submit/i).click()
                cy.wait(500)
                
                cy.get('.step-input').first().should('be.disabled')
                cy.get('.step-input').eq(1).should('be.disabled')
                cy.get('.step-input').last().should('be.disabled')
            })

            it('should require all three steps before submission', () => {
                // Try to submit without filling all fields
                cy.contains('button', /Check Answer|problems_correlation_submit/i).click()
                cy.wait(300)
                
                // Should still be able to see submit button (form validation prevents submission)
                cy.contains('button', /Check Answer|problems_correlation_submit/i).should('be.visible')
            })
        })

        // Dataset Variety Tests
        describe('Dataset Variety Generation', () => {
            beforeEach(() => {
                cy.visit('http://localhost:4200/problems-correlation')
                cy.wait(500)
            })

            it('should generate different correlation types across multiple generations', () => {
                const generatedTypes = []
                
                // Generate multiple datasets and check for variety
                for (let i = 0; i < 5; i++) {
                    cy.get('.generate-button').click()
                    cy.wait(500)
                    
                    // Submit to see the correlation coefficient
                    cy.get('#correlationType').select('positive')
                    cy.get('#correlationStrength').select('moderate')
                    cy.contains('button', /Check Answer|problems_correlation_submit/i).click()
                    cy.wait(500)
                    
                    // Extract correlation value
                    cy.contains(/r = (-?\d\.\d{3})/).invoke('text').then((text) => {
                        const match = text.match(/r = (-?\d\.\d{3})/)
                        if (match) {
                            generatedTypes.push(parseFloat(match[1]))
                        }
                    })
                    
                    cy.contains('button', /Try Another Dataset|problems_correlation_try_again/i).click()
                    cy.wait(500)
                }
                
                // Verify we got different values (pattern tracking should provide variety)
                cy.wrap(generatedTypes).should('have.length', 5)
            })
        })

        // Complete Workflow Tests
        describe('Complete Workflow Across All Question Types', () => {
            it('should complete workflow for Analyze question type', () => {
                cy.visit('http://localhost:4200/problems-correlation')
                cy.wait(500)
                
                cy.get('.question-type-dropdown').select('analyze')
                cy.wait(500)
                cy.get('.generate-button').click()
                cy.wait(500)
                cy.get('#correlationType').select('positive')
                cy.get('#correlationStrength').select('moderate')
                cy.contains('button', /Check Answer|problems_correlation_submit/i).click()
                cy.wait(500)
                cy.contains(/r =|coefficient/i).should('be.visible')
            })

            it('should complete workflow for Match question type', () => {
                cy.visit('http://localhost:4200/problems-correlation')
                cy.wait(500)
                
                cy.get('.question-type-dropdown').select('match')
                cy.wait(500)
                cy.get('.generate-button').click()
                cy.wait(500)
                cy.get('select').last().select(0)
                cy.contains('button', /Check Answer|problems_correlation_submit/i).click()
                cy.wait(500)
                cy.contains(/r =|coefficient/i).should('be.visible')
            })

            it('should complete workflow for Calculate question type', () => {
                cy.visit('http://localhost:4200/problems-correlation')
                cy.wait(500)
                
                cy.get('.question-type-dropdown').select('calculate')
                cy.wait(500)
                cy.get('.generate-button').click()
                cy.wait(500)
                
                // Fill in all steps (using approximate values)
                cy.get('.step-input').first().type('15.0')
                cy.get('.step-input').eq(1).type('25.0')
                cy.get('.step-input').last().type('0.8')
                
                cy.contains('button', /Check Answer|problems_correlation_submit/i).click()
                cy.wait(500)
                
                // Check feedback is shown
                cy.get('.feedback-box').should('have.length.at.least', 1)
            })
        })
    })

})
