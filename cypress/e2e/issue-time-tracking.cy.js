import { faker } from '@faker-js/faker';

describe('Time tracking creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`)
    });

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
    const openTimeTrackeing = () => cy.get('[data-testid="icon:stopwatch"]');
    const timeTrackingModal = () => cy.get('[data-testid="modal:tracking"]');

    it('Should create an issue and add, edit and delete time estimation', () => {
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board?modal-issue-create=true');
        });

        const lowerCaseTitle = faker.lorem.word();
        const title = lowerCaseTitle.charAt(0).toUpperCase() + lowerCaseTitle.slice(1);

        createAnIssue(title);

        cy.contains(title).click();
        getIssueDetailsModal().within(() => {
            cy.get('[placeholder="Number"]').type('4');
        });
        cy.get('[data-testid="icon:stopwatch"]').next().should('contain', '4h estimated');

        getIssueDetailsModal().within(() => {
            cy.get('[placeholder="Number"]').clear().type('8');
        });
        cy.get('[data-testid="icon:stopwatch"]').next().should('contain', '8h estimated');

        getIssueDetailsModal().within(() => {
            cy.get('[placeholder="Number"]').clear();
        });
        cy.get('[data-testid="icon:stopwatch"]').next()
            .should('not.contain', '8h estimated')
            .and('contain', 'No time logged');
    });


    it('Should log, edit and delete the time', () => {
        cy.contains('This is an issue of type: Task.').click();
        openTimeTrackeing().trigger('click');
        timeTrackingModal().within(() => {
            cy.get('[placeholder="Number"]').first().clear().type('4');
        })
        cy.contains('button', 'Done').click().should('not.exist');
        timeTrackingModal().should('not.exist');
        openTimeTrackeing().next()
            .should('contain', '4h logged');

        openTimeTrackeing().trigger('click');
        timeTrackingModal().within(() => {
            cy.get('[placeholder="Number"]').first().clear().type('8');
        })

        cy.contains('button', 'Done').click().should('not.exist');
        timeTrackingModal().should('not.exist');
        openTimeTrackeing().next()
            .should('contain', '8h logged');

        openTimeTrackeing().trigger('click');
        timeTrackingModal().within(() => {
            cy.get('[placeholder="Number"]').first().clear();
        })
        cy.contains('button', 'Done').click().should('not.exist');
        timeTrackingModal().should('not.exist');
        openTimeTrackeing().next()
            .should('contain', 'No time logged');
    });

    it('Should add time estimation and log actual time', () => {
        const estimatedHours = 7;
        const loggedTime = 3;

        cy.contains('This is an issue of type: Task.').click();
        getIssueDetailsModal().within(() => {
            cy.get('[placeholder="Number"]').clear().type(estimatedHours);
        });
        cy.get('[data-testid="icon:stopwatch"]').next().should('contain', estimatedHours + 'h estimated');

        openTimeTrackeing().trigger('click');
        timeTrackingModal().within(() => {
            cy.get('[placeholder="Number"]').first().clear().type(loggedTime);
        });
        cy.contains('button', 'Done').click().should('not.exist');
        timeTrackingModal().should('not.exist');
        openTimeTrackeing().next()
            .should('contain', loggedTime + 'h logged');
    })
})

function createAnIssue(name) {
    const description = faker.lorem.paragraph();
    cy.get('[data-testid="modal:issue-create"]').within(() => {
        cy.get('[data-testid="form-field:description"]').type(description);
        cy.get('input[name="title"]').type(name);
        cy.get('button[type="submit"]').click();
    });
}
