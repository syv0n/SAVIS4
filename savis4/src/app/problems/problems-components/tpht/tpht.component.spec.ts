import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TPHTProblemsComponent } from './tpht.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { LanguageSwitcherComponent } from 'src/app/components/language-switcher/language-switcher.component';
import { CalculatorComponent } from 'src/app/components/calculator/calculator.component';
import { AppFirebaseModule } from 'src/app/app-firebase.module';

describe('TPHTProblemsComponent', () => {
  let component: TPHTProblemsComponent;
  let fixture: ComponentFixture<TPHTProblemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TPHTProblemsComponent, NavbarComponent, LanguageSwitcherComponent, CalculatorComponent ],
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
    fixture = TestBed.createComponent(TPHTProblemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
