import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Contact } from '../models/contact.model';
import { MatDialog } from '@angular/material/dialog';
import { ContactEditDialogComponent } from '../dialogs/contact-edit-dialog/contact-edit-dialog.component';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  mockList : Contact[] =  [
    {
      id: 1,
      firstName : "Jim",
      lastName : "Jimson",
      phoneNumber: "",
      email : "",
    },
    {
      id: 2,
      firstName : "Jack",
      lastName : "Jackson",
      phoneNumber: "",
      email : "",
    }
  ]


  constructor(
    private dialog : MatDialog
  ) { }


  //#region mock back end calls

  getContactList$() : Observable<Contact[]> {

    return of(this.mockList).pipe(
      delay(2000)
    )

  }

  saveContact$(contact: Contact): Observable<Contact> {
    // Find the index of the contact in the list
    let index = _.findIndex(this.mockList, (c) => c.id === contact.id);
  
    if (index === -1) {
      // If the contact doesn't exist, create a new contact with a new id and add it to the list
      const newContact = { ...contact, id: this.getNextId() };
      this.mockList = [...this.mockList, newContact];
      return of(newContact);
    } else {
      // If the contact exists, update it
      const updatedContact = { ...contact };
      this.mockList = [
        ...this.mockList.slice(0, index),
        updatedContact,
        ...this.mockList.slice(index + 1)
      ];
      return of(updatedContact);
    }
  }
  

  private getNextId(): number {
    // Calculate the next ID based on the current highest ID
    return this.mockList.length > 0 ? Math.max(...this.mockList.map(c => c.id)) + 1 : 1;
  }

  editContactDialog$(contact: Contact | null) : Observable<Contact> {

    const dialogRef = this.dialog.open(ContactEditDialogComponent, {
      data: {
        contact
      }
    })

    return dialogRef.afterClosed();

  }

  //#endregion

}
