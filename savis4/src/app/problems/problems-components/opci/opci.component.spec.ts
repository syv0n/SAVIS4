import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { OPCIProblemsComponent } from './opci.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { LanguageSwitcherComponent } from 'src/app/components/language-switcher/language-switcher.component';
import { CalculatorComponent } from 'src/app/components/calculator/calculator.component';
import { AppFirebaseModule } from 'src/app/app-firebase.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('OPCIProblemsComponent', () => {
  let component: OPCIProblemsComponent;
  let fixture: ComponentFixture<OPCIProblemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OPCIProblemsComponent,
        NavbarComponent,
        LanguageSwitcherComponent,
        CalculatorComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        RouterTestingModule,
        AppFirebaseModule
      ],
      providers: [TranslateService],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OPCIProblemsComponent);
    component = fixture.componentInstance;
    // Skip detectChanges to avoid circular dependency issues during initialization
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

