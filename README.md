# CodingTask2025

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.1.

# Introduction
This repo contains a simple angular / ngrx project. The project consists of:
* Components - 
    The main structural elements of the app, this includes "Smart" components that interact with the store, and "Dumb" componenets that are only aware of their inputs and outputs.
* Dialogs - 
    Special componenets that make use of the Mat Dialog CDK, these are used for "User Input" effects.
* Models - 
    Define the shape of the data the app uses. (In our main codebase, this is where we would define out Zod schemas, for simplicity here we have just provided a simple type)
* Services - 
    The services are where we orchestrate interacting with the back end to perform CRUD operations, in this example we have provided some mock data and functions.
    This is also where we provide functions that launch the dialogs.
* State -
    The state folder contains the NGRX componenets for managing state.

In our main code base, you would expect to find this architecture replicated within each feature module that makes up the app. For simplicity here, we have included everything inside the app module.

# Your Mission
1. In the mock service, we have introduced an exaggerated delay when loading the contact list to simulate loading a larger data set into state. Extend the component, with the help of angular directives, to show a loading message when the contact list is empty.
2. We have the functionality to edit existing contacts, now add an "Add Contact" button to the contact list with the appropriate actions and effects. You should be able to re-use the contact-edit-dialog.
3. The effects deal with external interactions, as such there is no guarantee that they won't recieve an error response. How could we handle the case where a service function throws an error? You don't need to write any code for this one just, explain what you would change/add, optionally include an example snippet. (hint: rxjs provides an operator for this)
4. We have provided a Role type in the contact.model.ts file, assume a contact can be associated with one or many projects, and can have a different role on each. Explain with the help of diagrams what the interface for managing a contact's roles might look like and list the steps you would take to implement that feature. No code is required for this question, you can choose how you present this, either include it as a PDF in your repo, or provide a public link to a SAAS such as figma or whimsical.

# Answers

1. 
To show a loading message while a contact list is loading `src/app/components/contact-list/contact-list.component.html` was modified: 

    - <ng-container *ngIf="contactList$ | async as contactList"> subscribes to the observable and assigns the emitted array to a local variable called contactList; 

    - <div *ngIf="contactList.length === 0; else contactListLoaded"> checks if the list is empty. If it is, it shows a "Loading contacts..." message.

    - <ng-template #contactListLoaded> block contains the existing markup to iterate over and display the contacts.

2. 
Below are the modifications made to add the "Add Contact" functionality while re-using the existing contact-edit dialog:

**Actions:**  
   - Added a new action `addContactClicked` in `src/app/state/actions.ts` to trigger the add contact flow.

**Effects:**  
   - Created a new effect `launchAddDialog$` in `src/app/state/effects.ts` that listens for the `addContactClicked` action.
   - This effect opens the contact-edit dialog with a `null` parameter, indicating that a new contact is being added.
   - When the dialog closes, it dispatches either `editContactConfrimed` (if a contact is returned) or `editContactCancelled` (if the dialog is canceled).

**Component TypeScript:**  
   - Added a new method `addContactClicked()` in `src/app/components/contact-list/contact-list.component.ts` to dispatch the `addContactClicked` action.

**Component Template:**  
   - Updated `src/app/components/contact-list/contact-list.component.html` to include an "Add Contact" button that calls the new `addContactClicked()` method.

**Dialog Enhancement:**  
   - Modified `src/app/dialogs/contact-edit-dialog/contact-edit-dialog.component.html` to display "Add New Contact" as the title when no contact data is provided.

3. 
# Handling Service Errors in Effects

Since effects deal with external interactions, there's always a possibility that a service function might throw an error. To handle errors gracefully, we can use the `catchError` operator provided by RxJS. Here’s what should be done:

## Steps to Handle Errors

- **Define Error Actions:**  
  Create specific error actions (e.g., `contactListFailed`, `editContactFailed`) that will capture the error payload. These actions can be dispatched when an error occurs in an effect.

- **Update Effects with Error Handling:**  
  In each effect that interacts with an external service, modify the observable chain to include the `catchError` operator.
  - Use `catchError` to intercept errors from your service calls.
  - Inside `catchError`, return an observable (using `of`) that dispatches the appropriate error action. This ensures that when an error occurs, the effect doesn’t fail silently, and your application can respond (e.g., by logging the error or displaying an error message).

## Example Snippet

```typescript
import { catchError, of } from 'rxjs';

retrieveContactList$ = createEffect(() => this.actions$.pipe(
    ofType(actions.appStarted),
    concatMap(() =>
        this.contactService.getContactList$().pipe(
            map(contactList => actions.contactListReturned({ contactList })),
            // Catch any error thrown by the service and dispatch an error action
            catchError(error => of(actions.contactListFailed({ error })))
        )
    )
));

4. 
