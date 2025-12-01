import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TwoMeansComponent } from './two-means.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { LanguageSwitcherComponent } from 'src/app/components/language-switcher/language-switcher.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppFirebaseModule } from 'src/app/app-firebase.module';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('TwoMeansComponent', () => {
  let component: TwoMeansComponent;
  let fixture: ComponentFixture<TwoMeansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TwoMeansComponent, NavbarComponent, FooterComponent, LanguageSwitcherComponent],
      imports: [FormsModule, AppFirebaseModule, RouterTestingModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    
    fixture = TestBed.createComponent(TwoMeansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
