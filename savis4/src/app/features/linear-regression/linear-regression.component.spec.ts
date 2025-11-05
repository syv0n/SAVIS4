import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinearRegressionComponent } from './linear-regression.component';
import { SharedService } from 'src/app/services/shared.service';
import { ScatterPlotComponent } from './scatter-plot/scatter-plot.component';
import { CalculatorComponent } from 'src/app/components/calculator/calculator.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { AppFirebaseModule } from 'src/app/app-firebase.module';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LinearRegressionComponent', () => {
  let component: LinearRegressionComponent;
  let fixture: ComponentFixture<LinearRegressionComponent>;
  let mockSharedService: any;

  beforeEach(async () => {
    mockSharedService = {
      currentData: of('1,2\n3,4'),
      changeData: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [
        LinearRegressionComponent,
        ScatterPlotComponent,
        CalculatorComponent,
        NavbarComponent,
      ],
      imports: [
        FormsModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        AppFirebaseModule,
      ],
      providers: [{ provide: SharedService, useValue: mockSharedService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinearRegressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

