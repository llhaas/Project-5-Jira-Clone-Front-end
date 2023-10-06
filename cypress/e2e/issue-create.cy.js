import { faker } from '@faker-js/faker';

describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      cy.visit(url + '/board?modal-issue-create=true');
    });
  });

  it('Should create an issue and validate it successfully', () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
        .trigger('click');
      cy.get('.ql-editor').type('TEST_DESCRIPTION');
      cy.get('input[name="title"]').type('TEST_TITLE');
      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('button[type="submit"]').click();
    });

    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      cy.get('[data-testid="list-issue"]')
        .should('have.length', '5')
        .first()
        .find('p')
        .contains('TEST_TITLE');
      cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
      cy.get('[data-testid="icon:story"]').should('be.visible');
    });
  });

  it('Should validate title is required field if missing', () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('button[type="submit"]').click();
      cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required');
    });
  });

  it('Should create a bug', () => {

    const title = 'Bug';
    const description = 'My bug description';

    cy.get('[data-testid="modal:issue-create"]').within(() => {

      cy.get('.ql-editor').type(description);
      cy.get('input[name="title"]').type(title);

      cy.get('[data-testid="select:reporterId"]').then(($reporter) => {
        if (!$reporter.text().includes('Pickle Rick')) {
          cy.get('[data-testid="select:reporterId"]').click();
          cy.get('[data-testid="select-option:Pickle Rick"]').click();
        }
      })

      cy.get('[data-testid="select:priority"]').then(($priority) => {
        if (!$priority.text().includes('Highest')) {
          cy.get('[data-testid="select:priority"]').click();
          cy.get('[data-testid="select-option:Highest"]').click();
        }
      })


      cy.get('[data-testid="select:priority"]').then(($type) => {
        if (!$type.text().includes('Bug')) {
          cy.get('[data-testid="select:type"]').click();
          cy.get('[data-testid="select-option:Bug"]').click();
        }
      })

      cy.get('button[type="submit"]').click();
    });

    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      cy.get('[data-testid="list-issue"]')
        .should('have.length', '5')
        .first()
        .find('p')
        .contains(title)
      cy.get('[data-testid="list-issue"]').first().within(() => {
        cy.get('[data-testid="icon:bug"]').should('be.visible');
        cy.get('[data-testid="icon:arrow-up"]').should('be.visible');
      }
      )
    });
  });

  it('Should create a task', () => {

    const title = faker.lorem.word()
    const description = faker.lorem.sentence()


    cy.get('[data-testid="modal:issue-create"]').within(() => {

      cy.get('[data-testid="select:type"]').then(($type) => {
        if (!$type.text().includes('Task')) {
          cy.get('[data-testid="select:type"]').click();
          cy.get('[data-testid="select-option:Task"]').click();
        }
      })

      cy.get('.ql-editor').type(description);
      cy.get('input[name="title"]').type(title);

      cy.get('[data-testid="select:reporterId"]').then(($reporter) => {
        if (!$reporter.text().includes('Baby Yoda')) {
          cy.get('[data-testid="select:reporterId"]').click();
          cy.get('[data-testid="select-option:Baby Yoda"]').click();
        }
      })

      cy.get('[data-testid="select:priority"]').then(($priority) => {
        if (!$priority.text().includes('Low')) {
          cy.get('[data-testid="select:priority"]').click();
          cy.get('[data-testid="select-option:Low"]').click();
        }
      })

      cy.get('button[type="submit"]').click();
    });

    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      cy.get('[data-testid="list-issue"]')
        .should('have.length', '5')
        .first()
        .find('p')
        .contains(title)
      cy.get('[data-testid="list-issue"]')
        .first()
        .within(() => {
          cy.get('[data-testid="icon:task"]').should('be.visible');
          cy.get('[data-testid="icon:arrow-down"]').should('be.visible');
        }
        )
    });
  });

  it.only('Should validate titles match', () => {
    const title1 = 'Hello   word!'
    //cy.log(title.trim())
    createAnIssue(title1)
    cy.get('[data-testid="board-list:backlog').within(() => {
      cy.get('[data-testid="list-issue"]').children().first().then(($name) => {
        const givenTitle = $name.text();
        cy.log(title1);
        cy.log(givenTitle);
        expect(givenTitle).equals(title1);
      });

    });

  });

  // Create a new test that verifies that the application is removing unnecessary spaces on the board view.
  //   Create a new test in the spec file “issue-create.cy.js”.
  //   Define the issue title as a variable and add multiple spaces between words. 
  //For example: const title = ' Hello world!
  //   Create an issue with this title (a short summary), save the issue, 
  //and observe it on the board (issues on the board will not have extra spaces 
  //and will be trimmed).
  //   Access the created issue title (by default, new issues will be created at the top
  // of the backlog, so they will always be the first element in the list of all issues 
  //on the board).
  //   Assert this title with a predefined variable, but remove extra spaces from it 
  //(string function trim()).

});
function createAnIssue(titles) {
  const description = faker.lorem.sentence()
  cy.get('[data-testid="modal:issue-create"]').within(() => {
    cy.get('.ql-editor').type(description);
    cy.get('input[name="title"]').type(titles);
    cy.get('button[type="submit"]').click();
  });
  cy.get('[data-testid="modal:issue-create"]').should('not.exist');
  cy.contains('Issue has been successfully created.').should('be.visible');
  cy.reload();
  cy.contains('Issue has been successfully created.').should('not.exist');
}