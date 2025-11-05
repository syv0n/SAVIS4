describe('User Manual E2E Tests', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/user-manual')
    })
    
    it('should load the user manual page successfully', () => {
        cy.get('.user-manual-container').should('be.visible')
        cy.get('h1.title').should('be.visible')
        cy.get('app-navbar').should('be.visible')
        cy.get('footer').should('be.visible')
    })

    it('should display all four main categories', () => {
        cy.get('.tool1').should('be.visible')
        cy.get('.tool2').should('have.length', 2).each(($el) => {
            cy.wrap($el).should('be.visible')
        })
        cy.get('.tool3').should('be.visible')
    })
    
    describe('Hypothesis Testing Section', () => {
        it('should display all hypothesis testing boxes', () => {
            cy.get('.tool1').should('contain.text', 'Hypothesis Testing')
            cy.get('.box[routerLink="/opht"]').should('be.visible')
            cy.get('.box[routerLink="/tpht"]').should('be.visible')
            cy.get('.box[routerLink="/omht"]').should('be.visible')
            cy.get('.box[routerLink="/tmht"]').should('be.visible')
        })

        it('should navigate to One Proportion Hypothesis Test', () => {
            cy.get('.box[routerLink="/opht"]').click()
            cy.url().should('include', '/opht')
        })

        it('should navigate to Two Proportion Hypothesis Test', () => {
            cy.get('.box[routerLink="/tpht"]').click()
            cy.url().should('include', '/tpht')
        })

        it('should navigate to One Mean Hypothesis Test', () => {
            cy.get('.box[routerLink="/omht"]').click()
            cy.url().should('include', '/omht')
        })

        it('should navigate to Two Mean Hypothesis Test', () => {
            cy.get('.box[routerLink="/tmht"]').click()
            cy.url().should('include', '/tmht')
        })
    })

    describe('Graphs Section', () => {
        it('should display all graph boxes', () => {
            cy.get('.tool2').should('contain.text', 'Graphs')
            cy.get('.box2[routerLink="/bar-chart"]').should('be.visible')
            cy.get('.box2[routerLink="/dot-plot"]').should('be.visible')
        })

        it('should navigate to Bar Chart', () => {
            cy.get('.box2[routerLink="/bar-chart"]').click()
            cy.url().should('include', '/bar-chart')
        })

        it('should navigate to Dot Plot', () => {
            cy.get('.box2[routerLink="/dot-plot"]').click()
            cy.url().should('include', '/dot-plot')
        })
    })

    describe('Regression Section', () => {
        it('should display all regression boxes', () => {
            cy.contains('.tool2', 'Regression').should('be.visible')
            cy.get('.box2[routerLink="/regression"]').should('be.visible')
            cy.get('.box2[routerLink="/correlation-manual"]').should('be.visible')
        })

        it('should navigate to Regression', () => {
            cy.get('.box2[routerLink="/regression"]').click()
            cy.url().should('include', '/regression')
        })

        it('should navigate to Correlation Manual', () => {
            cy.get('.box2[routerLink="/correlation-manual"]').click()
            cy.url().should('include', '/correlation-manual')
        })
    })

    describe('Confidence Interval Section', () => {
        it('should display all confidence interval boxes', () => {
            cy.get('.tool3').should('contain.text', 'Confidence Interval')
            cy.get('.box3[routerLink="/opci"]').should('be.visible')
            cy.get('.box3[routerLink="/tpci"]').should('be.visible')
            cy.get('.box3[routerLink="/omci"]').should('be.visible')
            cy.get('.box3[routerLink="/tmci"]').should('be.visible')
        })

        it('should navigate to One Proportion Confidence Interval', () => {
            cy.get('.box3[routerLink="/opci"]').click()
            cy.url().should('include', '/opci')
        })

        it('should navigate to Two Proportion Confidence Interval', () => {
            cy.get('.box3[routerLink="/tpci"]').click()
            cy.url().should('include', '/tpci')
        })

        it('should navigate to One Mean Confidence Interval', () => {
            cy.get('.box3[routerLink="/omci"]').click()
            cy.url().should('include', '/omci')
        })

        it('should navigate to Two Mean Confidence Interval', () => {
            cy.get('.box3[routerLink="/tmci"]').click()
            cy.url().should('include', '/tmci')
        })
    })

    describe('Navigation Flow', () => {
        it('should navigate to multiple pages in sequence', () => {
            cy.get('.box[routerLink="/opht"]').click()
            cy.url().should('include', '/opht')
            
            cy.visit('localhost:4200/user-manual')

            cy.get('.box2[routerLink="/bar-chart"]').click()
            cy.url().should('include', '/bar-chart')
            cy.visit('localhost:4200/user-manual')
            cy.get('.box2[routerLink="/regression"]').click()
            cy.url().should('include', '/regression')
        })

        it('should return to user manual from any page', () => {
            cy.get('.box[routerLink="/opht"]').click()
            cy.url().should('include', '/opht')
            cy.go('back')
            cy.url().should('include', '/user-manual')
            cy.get('.user-manual-container').should('be.visible')
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
            cy.get('.box2').should('have.length', 4)
            cy.get('.box3').should('have.length', 4)
        })
    })

    describe('Error Handling', () => {
        it('should handle missing translations gracefully', () => {
            cy.get('.user-manual-container').should('be.visible')
            cy.get('.box-container').should('be.visible')
        })

        it('should not have broken navigation links', () => {
            cy.get('[routerLink]').each(($el) => {
                cy.wrap($el).should('have.attr', 'routerLink').and('not.be.empty')
            })
        })
    })
})