import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SaveLoadButtonsComponent } from './save-load-buttons.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('SaveLoadButtonsComponent', () => {
  let component: SaveLoadButtonsComponent;
  let fixture: ComponentFixture<SaveLoadButtonsComponent>;

  const mockAngularFireAuth: any = {
    authState: of({ uid: 'ABC123' }),
  };

  const mockAngularFirestore: any = {
    collection: () => ({
      get: () => Promise.resolve({ empty: true }),
      add: () => Promise.resolve(),
      valueChanges: () => of([]),
    }),
  };

  const mockDialog: any = {
    open: jest.fn().mockReturnValue({
      afterClosed: () => of({ save: true, data: {}, fileName: 'test' }),
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaveLoadButtonsComponent],
      imports: [
        AngularFireModule.initializeApp({}),
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: AngularFireAuth, useValue: mockAngularFireAuth },
        { provide: AngularFirestore, useValue: mockAngularFirestore },
        { provide: MatDialog, useValue: mockDialog },
        TranslateService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SaveLoadButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open save dialog', () => {
    component.saveDialog();
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should open load dialog', () => {
    component.loadDialog();
    expect(mockDialog.open).toHaveBeenCalled();
  });
});