describe('Admin Preparation Section Add Workflow', () => {
  beforeEach(() => {
    // Mock login or set auth tokens
    cy.visit('/preparation');
    // Ensure admin is logged in
    window.localStorage.setItem('Resume2Role-admin', 'true');
    window.localStorage.setItem('Resume2Role-token', 'Resume2Role-token-admin-1');
  });

  const sections = ['Video', 'Notes', 'Questions'];

  sections.forEach((section) => {
    it(`should successfully add a new ${section}`, () => {
      // Switch to section
      cy.contains('button', section).click();
      
      // Click Add button
      cy.contains('button', '+ Add').click();

      // Check modal is visible
      cy.contains(`Add New ${section}`).should('be.visible');

      // Fill form
      cy.get('input[placeholder*="Enter title"]').type('New Prep Item Title');
      cy.get('input[placeholder*="e.g. react-native"]').type('frontend');

      if (section === 'Video') {
        cy.get('input[placeholder*="youtube.com"]').type('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
        cy.get('input[type="file"]').selectFile({
          contents: Cypress.Buffer.from('file contents'),
          fileName: 'cover.jpg',
          lastModified: Date.now(),
        }, { force: true });
      } else {
        cy.get('textarea[placeholder*="description"]').type('Sample description for prep item.');
        cy.get('input[type="file"]').selectFile({
          contents: Cypress.Buffer.from('file contents'),
          fileName: 'notes.pdf',
          lastModified: Date.now(),
        }, { force: true });
      }

      // Submit
      cy.contains('button', `Add to ${section}`).click();

      // Check success toast/message
      cy.contains(`${section} added successfully!`).should('be.visible');
    });

    it(`should show validation errors for ${section}`, () => {
      cy.contains('button', section).click();
      cy.contains('button', '+ Add').click();

      // Try to submit empty form
      cy.contains('button', `Add to ${section}`).click();

      // Check validation message
      cy.contains('Title must be between 5 and 120 characters').should('be.visible');
    });
  });

  it('should handle network failure', () => {
    cy.intercept('POST', '/api/admin/*', {
      statusCode: 500,
      body: { message: 'Server error' },
    }).as('addPrep');

    cy.contains('button', 'Video').click();
    cy.contains('button', '+ Add').click();
    
    cy.get('input[placeholder*="Enter title"]').type('Valid Title for Failure Test');
    cy.get('input[placeholder*="e.g. react-native"]').type('frontend');
    cy.get('input[placeholder*="youtube.com"]').type('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('file contents'),
      fileName: 'cover.jpg',
    }, { force: true });

    cy.contains('button', 'Add to Video').click();
    
    cy.wait('@addPrep');
    cy.contains('Failed to add item. Please try again.').should('be.visible');
  });
});
