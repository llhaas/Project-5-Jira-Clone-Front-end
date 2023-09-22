describe('Issue create', () => {

    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/issues');
            cy.get('[data-testid="board-list:backlog"]').should('be.visible').and('have.length', '1').within(() => {
                cy.get('[data-testid="list-issue"]')
                    .first().click();
            });
            cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        });

    });

    it('Should delete the first issue', () => {
        cy.get('[data-testid="modal:issue-details"]').within(() => {
            cy.get('[data-testid="icon:trash"]').should('be.visible').click();

        });

        cy.get('[data-testid="modal:confirm"]').should('be.visible').within(() => {
            cy.contains('Delete issue').click();
        });
        cy.get('[data-testid="modal:confirm"]').should('not.exist');
        cy.get('[data-testid="modal:issue-details"]').should('not.exist');
        cy.get('[data-testid="board-list:backlog"]').should('be.visible').and('have.length', '1').within(() => {
            cy.get('[data-testid="list-issue"]').should('have.length', 3);
        });
    });

    it('Should cancel the deleting of the first issue', () => {
        cy.get('[data-testid="modal:issue-details"]').should('be.visible').within(() => {
            cy.get('[data-testid="icon:trash"]').should('be.visible').click();

        });

        cy.get('[data-testid="modal:confirm"]').should('be.visible').within(() => {
            cy.contains('Cancel').click();
        });
        cy.get('[data-testid="modal:confirm"]').should('not.exist');
        cy.get('[data-testid="modal:issue-details"]').should('be.visible').within(() => {
            cy.get('[data-testid="icon:close"]').first().trigger('click');
        })


        cy.get('[data-testid="board-list:backlog"]').should('be.visible').and('have.length', '1').within(() => {
            cy.get('[data-testid="list-issue"]').should('have.length', 4);
        });
    })

});