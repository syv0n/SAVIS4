import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadDialogComponent } from './load-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SharedService } from 'src/app/services/shared.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoadDialogComponent', () => {
  let component: LoadDialogComponent;
  let fixture: ComponentFixture<LoadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadDialogComponent],
      imports: [MatDialogModule, TranslateModule.forRoot(), FormsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { files: [], feature: 'test' } },
        { provide: MatDialogModule, useValue: {} },
        { provide: SharedService, useValue: {} },
        { provide: AngularFireAuth, useValue: {} },
        { provide: AngularFirestore, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

