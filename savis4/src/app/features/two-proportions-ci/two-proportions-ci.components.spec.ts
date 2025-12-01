import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TwoProportionsCIComponent } from './two-proportions-ci.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AppFirebaseModule } from 'src/app/app-firebase.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TwoProportionsCIComponent', () => {
  let component: TwoProportionsCIComponent;
  let fixture: ComponentFixture<TwoProportionsCIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TwoProportionsCIComponent,
        NavbarComponent,
        FooterComponent,
      ],
      imports: [
        FormsModule,
        TranslateModule.forRoot(),
        AppFirebaseModule,
        RouterTestingModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoProportionsCIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

