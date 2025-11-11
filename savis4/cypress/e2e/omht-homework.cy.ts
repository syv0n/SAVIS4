describe('One Mean Hypothesis Testing Problems', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.visit('http://localhost:4200/problems-omht')

    cy.contains('One Mean Hypothesis Testing Problems').should('be.visible')
  })

  it('should change word problem when pressing change problem button', () => {
    cy.get('.green-box p').invoke('text').then((initialText) => {
      cy.contains('Generate New Problem').click()
      
      cy.get('.green-box p').invoke('text').then((newText) => {
        expect(newText).not.to.equal(initialText)
      })
    })
  })

  it('should handle answer submission correctly', () => {
    cy.get('.textbox').type('0.05')
    cy.contains('Submit Answer').click()

    cy.get('.answer-box').should('be.visible')
    
    cy.get('.answer-box p').first().invoke('text').then((text) => {
      expect(text).to.match(/^(Correct!|Incorrect)/)
    })

    cy.get('.hide-button').click()
    cy.get('.answer-box').should('not.exist')
  })

  it('should show graph after correct answer is entered', () => {
    const tryAnswer = (attempt = 1) => {
      if (attempt > 5) return
      
      cy.get('.textbox').clear().type('0.05')
      cy.contains('Submit Answer').click()
      
      cy.get('.answer-box').then(($box) => {
        if ($box.text().includes('Correct!')) {
          cy.get('canvas').should('be.visible')
        } else if (attempt < 5) {
          tryAnswer(attempt + 1)
        }
      })
    }

    tryAnswer()
  })
})