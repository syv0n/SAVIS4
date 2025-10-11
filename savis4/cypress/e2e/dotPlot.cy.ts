describe('template spec', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/dotplot')
    })

    it('passes', () => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/dotplot')
      })

    
    it('should select and load example 1', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(500)
        cy.get('#load-data-btn').click()
      })
    it('should select and load example 2', () => {
        cy.get('#sample-data-options').select("Example 2")
        cy.wait(500)
        cy.get('#load-data-btn').click()
      })
    it('should click the reset button', () => {
        cy.get('#sample-data-options').select("Example 2")
        cy.wait(500)
        cy.get('#load-data-btn').click()
        cy.wait(500)
        cy.get('#reset-btn').click()
        cy.wait(500)
      })
   it('should select and load example 1 Sample', () => {
        cy.get('label#sampleButton').click(); // Click on the label element
        cy.wait(1500)
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(500)
        cy.get('#load-data-btn').click()
      })
  it('should input number into sample size', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(500)
        cy.get('#load-data-btn').click()
        cy.get('#sample-data-size').type('0')
      })

  it('should input number into sample size', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(500)
        cy.get('#load-data-btn').click()
        cy.get('#no-of-sample').type('0')
      })

  it('should run simulation', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(500)
        cy.get('#load-data-btn').click()
        cy.get('#no-of-sample').type('0')
        cy.get('#no-of-sample').type('0')
        cy.get('#get-sample-btn').click()
        cy.wait(300)
        cy.get('#get-sample-btn').click()
        cy.wait(300)
        cy.get('#get-sample-btn').click()
        cy.wait(300)
        cy.get('#get-sample-btn').click()
        cy.wait(300)
      })
  it('should input number into min input', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(500)
        cy.get('#load-data-btn').click()
        cy.get('#get-sample-btn').click()
        cy.get('#min-interValue').type('0')
      })
  it('should input number into max input', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(500)
        cy.get('#load-data-btn').click()
        cy.get('#get-sample-btn').click()
        cy.get('#max-interValue').type('0')
      })
  it('should check the include min', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(500)
        cy.get('#load-data-btn').click()
        cy.get('#get-sample-btn').click()
        cy.get('#includeMin').click()
      })
  it('should check the include max', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(500)
        cy.get('#load-data-btn').click()
        cy.get('#get-sample-btn').click()
        cy.get('#includeMax').click()
      })


  // --- NEW EXPORT TESTS ---
    describe('Export Functionality', () => {
        const downloadsFolder = Cypress.config('downloadsFolder');

        beforeEach(() => {
            // Load data before each export test
            cy.get('#sample-data-options').select("Example 1");
            cy.get('#load-data-btn').click();
            cy.wait(500); // wait for chart to render
        });

        it('should download the input data as a PDF and DOCX', () => {
            const pdfFileName = 'dot-plot-input-export.pdf';
            const pdfFilePath = `${downloadsFolder}/${pdfFileName}`;
            cy.get('button').contains('Export as PDF').first().click();
            cy.task('checkFileExists', pdfFilePath).should('be.true');
            
            const docxFileName = 'dot-plot-input-export.docx';
            const docxFilePath = `${downloadsFolder}/${docxFileName}`;
            cy.get('button').contains('Export as DOCX').first().click();
            cy.task('checkFileExists', docxFilePath).should('be.true');
        });

        it('should download the sample data as a PDF and DOCX', () => {
            // Generate sample data
            cy.get('#get-sample-btn').click();
            cy.wait(500);

            const pdfFileName = 'dot-plot-sample-export.pdf';
            const pdfFilePath = `${downloadsFolder}/${pdfFileName}`;
            cy.get('.chart-input-form').eq(1).find('button').contains('Export as PDF').click();
            cy.task('checkFileExists', pdfFilePath).should('be.true');

            const docxFileName = 'dot-plot-sample-export.docx';
            const docxFilePath = `${downloadsFolder}/${docxFileName}`;
            cy.get('.chart-input-form').eq(1).find('button').contains('Export as DOCX').click();
            cy.task('checkFileExists', docxFilePath).should('be.true');
        });

        it('should download the sample means data as a PDF and DOCX', () => {
            // Generate sample means data
            cy.get('#get-sample-btn').click();
            cy.wait(500);

            const pdfFileName = 'dot-plot-means-export.pdf';
            const pdfFilePath = `${downloadsFolder}/${pdfFileName}`;
            cy.get('.chart-input-form').eq(2).find('button').contains('Export as PDF').click();
            cy.task('checkFileExists', pdfFilePath).should('be.true');
            
            const docxFileName = 'dot-plot-means-export.docx';
            const docxFilePath = `${downloadsFolder}/${docxFileName}`;
            cy.get('.chart-input-form').eq(2).find('button').contains('Export as DOCX').click();
            cy.task('checkFileExists', docxFilePath).should('be.true');
        });
    });
     
})