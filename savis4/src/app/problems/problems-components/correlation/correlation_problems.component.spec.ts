import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CorrelationProblemsComponent } from './correlation_problems.component';

describe('ProblemsComponent', () => {
  let component: CorrelationProblemsComponent;
  let fixture: ComponentFixture<CorrelationProblemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrelationProblemsComponent ],
      imports: [ TranslateModule.forRoot() ],
      providers: [ TranslateService ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrelationProblemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
