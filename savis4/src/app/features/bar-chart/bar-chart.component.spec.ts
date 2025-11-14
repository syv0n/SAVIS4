import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarChartComponent } from './bar-chart.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AppFirebaseModule } from 'src/app/app-firebase.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { SaveLoadButtonsComponent } from 'src/app/components/save-load-buttons/save-load-buttons.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { LanguageSwitcherComponent } from 'src/app/components/language-switcher/language-switcher.component';
import { CalculatorComponent } from 'src/app/components/calculator/calculator.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        TranslateModule.forRoot(),
        AppFirebaseModule,
        RouterTestingModule,
        MatDialogModule
      ],
      declarations: [
        BarChartComponent,
        FooterComponent,
        NavbarComponent,
        SaveLoadButtonsComponent,
        LanguageSwitcherComponent,
        CalculatorComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

