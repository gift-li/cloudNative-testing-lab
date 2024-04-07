describe('[Form] init test', () => {
  it('Should load my website "/form" and contain title "Form"', () => {
    // action: visit the website
    cy.visit('/')

    // assertion: check title
    cy.contains('My Todos')

    // assertion: check required form elements existed
    cy.get('#name').should('exist')
    cy.get('#description').should('exist')
    cy.get('button').contains('Add Todo').should('exist')
  })
})

describe('[Form] operation test', () => {
  afterEach(() => {
    // clear form input
    cy.get('#name').clear()
    cy.get('#description').clear()
    // clear all todo items by clicking delete button if exists
    cy.get('.Card-button__delete')
      .should(() => { })
      .then(($button) => {
        if ($button.length) {
          cy.get('.Card-button__delete').each(($el) => {
            cy.wrap($el).click()
          })
        } else {
          return
        }
      })
  })

  describe('button disabled test', () => {
    it('Should have disabled button when name is empty', () => {
      // action: fill out the description
      cy.get('#description').type('Test description')

      // assertion: check the button is disabled
      cy.get('button').contains('Add Todo').should('be.disabled')
    })

    it('Should have disabled button when description is empty', () => {
      // action: fill out the name
      cy.get('#name').type('Test Name')

      // assertion: check the button is disabled
      cy.get('button').contains('Add Todo').should('be.disabled')
    })
  })

  describe('create test', () => {
    it('fill out the form and submit , should insert new todo item', () => {
      // action: fill out the form
      cy.get('#name').type('Test Name')
      cy.get('#description').type('Test description')

      // action: submit the form
      cy.get('button').contains('Add Todo').click()

      // assertion: check the new todo item is inserted into the list
      cy.contains('Test Name')
      cy.contains('Test description')
    })

    it('fill out the form and submit, should clear the form', () => {
      // action: fill out the form
      cy.get('#name').type('Test Name')
      cy.get('#description').type('Test description')

      // action: submit the form
      cy.get('button').contains('Add Todo').should('be.enabled')
      cy.get('button').contains('Add Todo').click()

      // assertion: check the form is cleared
      cy.get('#name').should('have.value', '')
      cy.get('#description').should('have.value', '')
    })
  })

  describe('complete test', () => {
    beforeEach(() => {
      // set default todo item
      cy.get('#name').type('Test Name')
      cy.get('#description').type('Test description')
      cy.get('button').contains('Add Todo').click()
    })

    it('click target complete button, it should has line-through class on name and description', () => {
      // action: click the complete button
      cy.get('.Card--button__done').click()

      // assertion: check the name and description has line-through class
      cy.get('.Card--text h1').should('have.class', 'line-through')
      cy.get('.Card--text span').should('have.class', 'line-through')
    })
  })

  describe('delete test', () => {
    beforeEach(() => {
      // set default todo item
      cy.get('#name').type('Test Name')
      cy.get('#description').type('Test description')
      cy.get('button').contains('Add Todo').click()
    })

    it('click target delete button, it should remove the todo item', () => {
      // action: click the delete button
      cy.get('button.Card-button__delete').click()

      // assertion: check the todo item is removed
      cy.contains('Test Name').should('not.exist')
      cy.contains('Test description').should('not.exist')
    })
  })
})