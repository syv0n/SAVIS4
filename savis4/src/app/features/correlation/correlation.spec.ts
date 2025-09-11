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
      ],
      imports: [
        ReactiveFormsModule,
        AppFirebaseModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
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
