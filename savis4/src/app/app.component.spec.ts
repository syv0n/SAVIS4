import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { AppFirebaseModule } from './app-firebase.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [AppFirebaseModule],
      providers: [
        { provide: AngularFireAuth, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
    expect(app.title).toEqual('Savis3');
  });
});

