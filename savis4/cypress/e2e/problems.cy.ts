describe('Practice Problems E2E Tests', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/problems')
    })
    
    it('should load the practice problems page successfully', () => {
        cy.get('.problems-container').should('be.visible')
        cy.get('h1.title').should('be.visible')
        cy.get('app-navbar').should('be.visible')
        cy.get('footer').should('be.visible')
    })

    it('should display all four main categories', () => {
        cy.get('.tool1').should('be.visible')
        cy.get('.tool2').should('be.visible')
        cy.get('.tool3').should('be.visible')
        cy.get('.tool4').should('be.visible')
    })
    
    describe('Hypothesis Testing Section', () => {
        it('should display all hypothesis testing boxes', () => {
            cy.get('.tool1').should('contain.text', 'Hypothesis Testing')
            cy.get('.box[routerLink="/problems-opht"]').should('be.visible')
            cy.get('.box[routerLink="/problems-tpht"]').should('be.visible')
            cy.get('.box[routerLink="/problems-omht"]').should('be.visible')
            cy.get('.box[routerLink="/problems-tmht"]').should('be.visible')
        })

        it('should navigate to One Proportion Hypothesis Test', () => {
            cy.get('.box[routerLink="/problems-opht"]').click()
            cy.url().should('include', '/problems-opht')
        })

        it('should navigate to Two Proportion Hypothesis Test', () => {
            cy.get('.box[routerLink="/problems-tpht"]').click()
            cy.url().should('include', '/problems-tpht')
        })

        it('should navigate to One Mean Hypothesis Test', () => {
            cy.get('.box[routerLink="/problems-omht"]').click()
            cy.url().should('include', '/problems-omht')
        })

        it('should navigate to Two Mean Hypothesis Test', () => {
            cy.get('.box[routerLink="/problems-tmht"]').click()
            cy.url().should('include', '/problems-tmht')
        })
    })

    describe('Graphs Section', () => {
        it('should display all graph boxes', () => {
            cy.get('.tool2').should('contain.text', 'Graphs')
            cy.get('.box2[routerLink="/problems-bar-chart"]').should('be.visible')
            cy.get('.box2[routerLink="/problems-dot-plot"]').should('be.visible')
        })

        it('should navigate to Bar Chart', () => {
            cy.get('.box2[routerLink="/problems-bar-chart"]').click()
            cy.url().should('include', '/problems-bar-chart')
        })

        it('should navigate to Dot Plot', () => {
            cy.get('.box2[routerLink="/problems-dot-plot"]').click()
            cy.url().should('include', '/problems-dot-plot')
        })
    })

    describe('Regression Section', () => {
        it('should display all regression boxes', () => {
            cy.get('.tool3').should('contain.text', 'Regression')
            cy.get('.box3[routerLink="/problems-regression"]').should('be.visible')
        })

        it('should navigate to Regression', () => {
            cy.get('.box3[routerLink="/problems-regression"]').click()
            cy.url().should('include', '/problems-regression')
        })
    })

    describe('Confidence Interval Section', () => {
        it('should display all confidence interval boxes', () => {
            cy.get('.tool4').should('contain.text', 'Confidence Interval')
            cy.get('.box4[routerLink="/problems-opci"]').should('be.visible')
            cy.get('.box4[routerLink="/problems-tpci"]').should('be.visible')
            cy.get('.box4[routerLink="/problems-omci"]').should('be.visible')
            cy.get('.box4[routerLink="/problems-tmci"]').should('be.visible')
        })

        it('should navigate to One Proportion Confidence Interval', () => {
            cy.get('.box4[routerLink="/problems-opci"]').click()
            cy.url().should('include', '/problems-opci')
        })

        it('should navigate to Two Proportion Confidence Interval', () => {
            cy.get('.box4[routerLink="/problems-tpci"]').click()
            cy.url().should('include', '/problems-tpci')
        })

        it('should navigate to One Mean Confidence Interval', () => {
            cy.get('.box4[routerLink="/problems-omci"]').click()
            cy.url().should('include', '/problems-omci')
        })

        it('should navigate to Two Mean Confidence Interval', () => {
            cy.get('.box4[routerLink="/problems-tmci"]').click()
            cy.url().should('include', '/problems-tmci')
        })
    })

    describe('Navigation Flow', () => {
        it('should navigate to multiple pages in sequence', () => {
            cy.get('.box[routerLink="/problems-opht"]').click()
            cy.url().should('include', '/problems-opht')
            
            cy.visit('localhost:4200/problems')

            cy.get('.box2[routerLink="/problems-bar-chart"]').click()
            cy.url().should('include', '/problems-bar-chart')
            cy.visit('localhost:4200/problems')
            cy.get('.box3[routerLink="/problems-regression"]').click()
            cy.url().should('include', '/problems-regression')
        })

        it('should return to user manual from any page', () => {
            cy.get('.box[routerLink="/problems-opht"]').click()
            cy.url().should('include', '/problems-opht')
            cy.go('back')
            cy.url().should('include', '/problems')
            cy.get('.problems-container').should('be.visible')
        })
    })

    describe('Visual Layout', () => {
        it('should maintain layout on different viewport sizes', () => {
            cy.viewport(1920, 1080)
            cy.get('.box-container').should('be.visible')
            cy.viewport(768, 1024)
            cy.get('.box-container').should('be.visible')
            cy.viewport(375, 667)
            cy.get('.box-container').should('be.visible')
        })

        it('should have consistent styling across all boxes', () => {
            cy.get('.box').should('have.length', 4)
            cy.get('.box2').should('have.length', 2)
            cy.get('.box3').should('have.length', 2)
            cy.get('.box4').should('have.length', 4)
        })
    })

    describe('Error Handling', () => {
        it('should handle missing translations gracefully', () => {
            cy.get('.problems-container').should('be.visible')
            cy.get('.box-container').should('be.visible')
        })

        it('should not have broken navigation links', () => {
            cy.get('[routerLink]').each(($el) => {
                cy.wrap($el).should('have.attr', 'routerLink').and('not.be.empty')
            })
        })
    })
})