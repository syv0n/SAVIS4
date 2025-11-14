import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OneMeanCIComponent } from './one-mean-ci.component';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

describe('OneMeanCIComponent', () => {
  let component: OneMeanCIComponent;
  let fixture: ComponentFixture<OneMeanCIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OneMeanCIComponent],
      imports: [FormsModule, ChartsModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OneMeanCIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

