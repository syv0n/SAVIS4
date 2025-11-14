import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { OneMeanComponent } from './one-mean.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

describe('OneMeanComponent', () => {
  let component: OneMeanComponent;
  let fixture: ComponentFixture<OneMeanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OneMeanComponent],
      imports: [FormsModule, ChartsModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OneMeanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
