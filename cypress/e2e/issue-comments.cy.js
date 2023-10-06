import { faker } from '@faker-js/faker';

describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

    it('Should create a comment successfully', () => {
        const comment = 'TEST_COMMENT';

        getIssueDetailsModal().within(() => {
            cy.contains('Add a comment...')
                .click();

            cy.get('textarea[placeholder="Add a comment..."]').type(comment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            cy.contains('Add a comment...').should('exist');
            cy.get('[data-testid="issue-comment"]').should('contain', comment);
        });
    });

    it('Should edit a comment successfully', () => {
        const previousComment = 'An old silent pond...';
        const comment = 'TEST_COMMENT_EDITED';

        getIssueDetailsModal().within(() => {
            cy.get('[data-testid="issue-comment"]')
                .first()
                .contains('Edit')
                .click()
                .should('not.exist');

            cy.get('textarea[placeholder="Add a comment..."]')
                .should('contain', previousComment)
                .clear()
                .type(comment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            cy.get('[data-testid="issue-comment"]')
                .should('contain', 'Edit')
                .and('contain', comment);
        });
    });

    it('Should delete a comment successfully', () => {
        getIssueDetailsModal()
            .find('[data-testid="issue-comment"]')
            .contains('Delete')
            .click();

        cy.get('[data-testid="modal:confirm"]')
            .contains('button', 'Delete comment')
            .click()
            .should('not.exist');

        getIssueDetailsModal()
            .find('[data-testid="issue-comment"]')
            .should('not.exist');
    });

    it('Should add, edit and remove a comment', () => {
        const myComment = faker.lorem.paragraph();
        addAComment(myComment);

        const newComment = faker.lorem.paragraph();
        editFirstComment(myComment, newComment)

        deleteFirstComment(newComment)

        getIssueDetailsModal().within(() => {
            cy.get('[data-testid="icon:close"]').first()
                .click()
        });
    })

})

function addAComment(comment) {
    cy.get('[data-testid="modal:issue-details"]').within(() => {
        cy.contains('Add a comment...')
            .click();

        cy.get('textarea[placeholder="Add a comment..."]').type(comment);

        cy.contains('button', 'Save')
            .click()
            .should('not.exist');

        cy.contains('Add a comment...').should('exist');
        cy.get('[data-testid="issue-comment"]').should('contain', comment);
    })
}

function editFirstComment(previousComment, newComment) {
    cy.get('[data-testid="modal:issue-details"]').within(() => {
        cy.get('[data-testid="issue-comment"]')
            .first()
            .contains('Edit')
            .click()
            .should('not.exist');

        cy.get('textarea[placeholder="Add a comment..."]')
            .should('contain', previousComment)
            .clear()
            .type(newComment);

        cy.contains('button', 'Save')
            .click()
            .should('not.exist');

        cy.get('[data-testid="issue-comment"]')
            .should('contain', 'Edit')
            .and('contain', newComment);
    })
}

function deleteFirstComment(commentToDelete) {
    cy.get('[data-testid="modal:issue-details"]').within(() => {
        cy.get('[data-testid="issue-comment"]')
            .first()
            .contains('Delete')
            .click();
    })
    cy.get('[data-testid="modal:confirm"]')
        .contains('button', 'Delete comment')
        .click()
        .should('not.exist');
    cy.get('[data-testid="modal:issue-details"]').find('[data-testid="issue-comment"]')
        .should('not.contain', commentToDelete);
}