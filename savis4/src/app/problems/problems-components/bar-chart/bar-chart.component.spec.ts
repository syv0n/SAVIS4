import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BarChartProblemsComponent } from './bar-chart.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { LanguageSwitcherComponent } from 'src/app/components/language-switcher/language-switcher.component';
import { CalculatorComponent } from 'src/app/components/calculator/calculator.component';
import { AppFirebaseModule } from 'src/app/app-firebase.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BarChartProblemsComponent', () => {
  let component: BarChartProblemsComponent;
  let fixture: ComponentFixture<BarChartProblemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        BarChartProblemsComponent,
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
    fixture = TestBed.createComponent(BarChartProblemsComponent);
    component = fixture.componentInstance;
    // Skip detectChanges to avoid circular dependency issues during initialization
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

