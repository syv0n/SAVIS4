describe('template spec', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/login')
    })
    
    it('passes', () => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/login')
        // cy.get('.form-incline > #forget').click()
    })

    it('should display the login form', () => {
        cy.get('[formControlName = "username"]').type('test@gmail.com')
        cy.get('[formControlName = "password"]').type('Test1234!')
        cy.contains('button', 'Login').should('be.visible').click()
        cy.url().should('be.equal', 'http://localhost:4200/homepage')
    })

    // it('should pop up error message if invalid email or password', () => {
    //     cy.get('[formControlName = "username"]').type('t@gmail.com')
    //     cy.get('[formControlName = "password"]').type('test')
    //     cy.contains('button', 'Login').click()
    //     cy.window().then((win) => {
    //         cy.stub(win.console, 'log').as('consoleLog')
    //     })
    //     cy.get('@consoleLog').should('have.been.calledWith', 'invalid')
    // })

    it('should pop up invalid form if nothing entered', () => {
        cy.contains('button', 'Login').click()
        //cy.wait(1000)
        cy.on('window:alert', (message) => {
            expect(message).to.equal('Your form is invalid')
        })
    })
    
    it('should click the forgot password', () => {
        cy.wait(1000)
        cy.get('#forget').click()
    })

    it('should click sign up button', () => {
        cy.wait(1000)
        cy.get('a[routerLink="/signup"]').click()
    })

    it('should click the continue as guest button', () => {
        cy.wait(1000)
        cy.contains('button', 'Guest').click()
    })
    
})