describe('template spec', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/forgotpassword')
    })

    it('passes', () => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/forgotpassword')
        // cy.get('.form-incline > #forget').click()
    })

    it('should display forgotpassword form', () => {
        cy.get('[formControlName = "email"]').type('test@gmail.com')
        cy.get('button[type="submit"').click()
        cy.wait(1000)
        cy.log('Password reset email sent, please check your email. You will be redirected to the login page in 5 seconds.')
    })

    it('should display if incorrect email entered', () => {
        cy.get('[formControlName = "email"]').type('test111')
        cy.get('button[type="submit"]').click()
        cy.wait(1000)
    })

    it('should follow link back to login page', () => {
        cy.get('#forget').click()
    })
    
})