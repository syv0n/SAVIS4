import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { OMCIManualComponent } from './omci.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { LanguageSwitcherComponent } from 'src/app/components/language-switcher/language-switcher.component';
import { CalculatorComponent } from 'src/app/components/calculator/calculator.component';
import { AppFirebaseModule } from 'src/app/app-firebase.module';

describe('OMCIManualComponent', () => {
  let component: OMCIManualComponent;
  let fixture: ComponentFixture<OMCIManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OMCIManualComponent, NavbarComponent, FooterComponent, LanguageSwitcherComponent, CalculatorComponent ],
      imports: [ 
        TranslateModule.forRoot(),
        RouterTestingModule,
        AppFirebaseModule
      ],
      providers: [ TranslateService ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OMCIManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
