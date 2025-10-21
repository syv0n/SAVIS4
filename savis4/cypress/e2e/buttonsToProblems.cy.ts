describe('Buttons Link to Practice Problems', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200')
    })

    it('should go from /barchart to /problems-bar-chart', () => {
        cy.visit('http://localhost:4200/barchart')
        cy.contains('Bar Chart Practice Problems')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/problems-bar-chart')
        cy.contains('Bar Chart Problems').should('be.visible')
      }) 

    it('should go from /dotplot to /problems-dot-plot', () => {
        cy.visit('http://localhost:4200/dotplot')
        cy.contains('Dot Plot Practice Problems')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/problems-dot-plot')
        cy.contains('Dot Plot Problems').should('be.visible')
      })

    it('should go from /oneproportion to /problems-opht', () => {
        cy.visit('http://localhost:4200/oneproportion')
        cy.contains('One Proportion Hypothesis Testing Practice Problems')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/problems-opht')
        cy.contains('One Proportion Hypothesis Testing Problems').should('be.visible')
      })

    it('should go from /twoproportions to /problems-tpht', () => {
        cy.visit('http://localhost:4200/twoproportions')
        cy.contains('Two Proportion Hypothesis Testing Practice Problems')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/problems-tpht')
        cy.contains('Two Proportion Hypothesis Testing Problems').should('be.visible')
      })

    it('should go from /onemean to /problems-omht', () => {
        cy.visit('http://localhost:4200/onemean')
        cy.contains('One Mean Hypothesis Testing Practice Problems')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/problems-omht')
        cy.contains('One Mean Hypothesis Testing Problems').should('be.visible')
      })

    it('should go from /twomeans to problems-tmht', () => {
        cy.visit('http://localhost:4200/twomeans')
        cy.contains('Two Mean Hypothesis Testing Practice Problems')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/problems-tmht')
        cy.contains('Two Mean Hypothesis Testing Problems').should('be.visible')
      })  

    it('should go from /LR to problems-regression', () => {
        cy.visit('http://localhost:4200/LR')
        cy.contains('Linear Regression Practice Problems')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/problems-regression')
        cy.contains('Regression Problems').should('be.visible')
      })  

    it('should go from /correlation to problems-correlation', () => {
        cy.visit('http://localhost:4200/correlation')
        cy.contains('Correlation Practice Problems')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/problems-correlation')
        cy.contains('Correlation Problems').should('be.visible')
      }) 
      
    it('should go from /oneproportionCI to problems-opci', () => {
        cy.visit('http://localhost:4200/oneproportionCI')
        cy.contains('One Proportion Confidence Interval Practice Problems')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/problems-opci')
        cy.contains('One Proportion Confidence Interval Problems').should('be.visible')
      })   

    it('should go from /twoproportionsCI to problems-tpci', () => {
        cy.visit('http://localhost:4200/twoproportionsCI')
        cy.contains('Two Proportion Confidence Interval Practice Problems')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/problems-tpci')
        cy.contains('Two Proportion Confidence Interval Problems').should('be.visible')
      })     

    it('should go from /onemeanCI to problems-omci', () => {
        cy.visit('http://localhost:4200/onemeanCI')
        cy.contains('One Mean Confidence Interval Practice Problems')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/problems-omci')
        cy.contains('One Mean Confidence Interval Problems').should('be.visible')
      })     

    it('should go from /twomeansCI to problems-tmci', () => {
        cy.visit('http://localhost:4200/twomeansCI')
        cy.contains('Two Mean Confidence Interval Practice Problems')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/problems-tmci')
        cy.contains('Two Mean Confidence Interval Problems').should('be.visible')
      })   

    // MANUAL -> GRAPH PAGES

    it('should go from /opht to oneproportion', () => {
        cy.visit('http://localhost:4200/opht')
        cy.contains('One Proportion Hypothesis Graph')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/oneproportion')
        cy.contains('One Proportion Hypothesis Testing').should('be.visible')
    })

      it('should go from /tpht to twoproportions', () => {
        cy.visit('http://localhost:4200/tpht')
        cy.contains('Two Proportions Hypothesis Graph')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/twoproportions')
        cy.contains('Two Proportion Hypothesis Testing').should('be.visible')
      })

      it('should go from /omht to onemean', () => {
        cy.visit('http://localhost:4200/omht')
        cy.contains('One Mean Hypothesis Graph')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/onemean')
        cy.contains('One Mean Hypothesis Testing').should('be.visible')
      })

      it('should go from /tmht to twomeans', () => {
        cy.visit('http://localhost:4200/tmht')
        cy.contains('Two Means Hypothesis Graph')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/twomeans')
        cy.contains('Two Means Hypothesis Testing').should('be.visible')
      })

      it('should go from /bar-chart to barchart', () => {
        cy.visit('http://localhost:4200/bar-chart')
        cy.contains('Bar Chart Graph')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/barchart')
        cy.contains('Bar Chart').should('be.visible')
      })

      it('should go from /dot-plot to dotplot', () => {
        cy.visit('http://localhost:4200/dot-plot')
        cy.contains('Dot Plot Graph')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/dotplot')
        cy.contains('Dot Plot').should('be.visible')
      })

      it('should go from /omht to onemean', () => {
        cy.visit('http://localhost:4200/omht')
        cy.contains('One Mean Hypothesis Graph')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/onemean')
        cy.contains('One Mean Hypothesis Testing').should('be.visible')
      })

      it('should go from /regression to LR', () => {
        cy.visit('http://localhost:4200/regression')
        cy.contains('Regression Graph')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/LR')
        cy.contains('Regression Line and Confidence Intervals').should('be.visible')
      })

      it('should go from /correlation-manual to correlation', () => {
        cy.visit('http://localhost:4200/correlation-manual')
        cy.contains('Correlation Graph')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/correlation')
        cy.contains('Correlation Component').should('be.visible')
      })

      it('should go from /opci to oneproportionCI', () => {
        cy.visit('http://localhost:4200/opci')
        cy.contains('One Proportion Confidence Interval Graph')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/oneproportionCI')
        cy.contains('One Proportion Confidence Interval Testing').should('be.visible')
      })

      it('should go from /tpci to twoproportionsCI', () => {
        cy.visit('http://localhost:4200/tpci')
        cy.contains('Two Proportions Confidence Graph')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/twoproportionsCI')
        cy.contains('Two Proportions Confidence Interval').should('be.visible')
      })

      it('should go from /omci to onemeanCI', () => {
        cy.visit('http://localhost:4200/omci')
        cy.contains('One Mean Confidence Interval Graph')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/onemeanCI')
        cy.contains('One Mean Confidence Interval').should('be.visible')
      })

      it('should go from /tmci to twomeansCI', () => {
        cy.visit('http://localhost:4200/tmci')
        cy.contains('Two Means Confidence Interval Graph')
        .invoke('removeAttr','target')
        .click()
        cy.url().should('include', 'http://localhost:4200/twomeansCI')
        cy.contains('Two Means Confidence Interval').should('be.visible')
      })
})
