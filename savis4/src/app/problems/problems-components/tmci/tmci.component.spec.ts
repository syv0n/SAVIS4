import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TMCIProblemsComponent } from './tmci.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { LanguageSwitcherComponent } from 'src/app/components/language-switcher/language-switcher.component';
import { CalculatorComponent } from 'src/app/components/calculator/calculator.component';
import { AppFirebaseModule } from 'src/app/app-firebase.module';

describe('TMCIProblemsComponent', () => {
  let component: TMCIProblemsComponent;
  let fixture: ComponentFixture<TMCIProblemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TMCIProblemsComponent, NavbarComponent, LanguageSwitcherComponent, CalculatorComponent ],
      imports: [ 
        TranslateModule.forRoot(),
        FormsModule,
        RouterTestingModule,
        AppFirebaseModule
      ],
      providers: [ TranslateService ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TMCIProblemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
