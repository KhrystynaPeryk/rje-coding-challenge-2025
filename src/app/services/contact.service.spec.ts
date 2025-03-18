import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ContactService } from './contact.service';

describe('ContactService', () => {
  let service: ContactService;
  let dialogMock: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    dialogMock.open.and.returnValue({
      afterClosed: () => of(null)
    } as any);

    TestBed.configureTestingModule({
      providers: [
        ContactService,
        { provide: MatDialog, useValue: dialogMock }
      ]
    });
    service = TestBed.inject(ContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});