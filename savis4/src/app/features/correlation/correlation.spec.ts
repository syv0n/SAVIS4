import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CorrelationComponent } from './correlation.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { InputComponent } from './input/input.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LanguageSwitcherComponent } from 'src/app/components/language-switcher/language-switcher.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { AppFirebaseModule } from 'src/app/app-firebase.module';
import { CalculatorComponent } from 'src/app/components/calculator/calculator.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CorrelationComponent', () => {
  let component: CorrelationComponent;
  let fixture: ComponentFixture<CorrelationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CorrelationComponent,
        NavbarComponent,
        InputComponent,
        FooterComponent,
        LanguageSwitcherComponent,
        CalculatorComponent,
      ],
      imports: [
        ReactiveFormsModule,
        AppFirebaseModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

