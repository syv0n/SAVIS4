import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OMHTProblemsComponent } from './omht.component';

describe('ProblemsComponent', () => {
  let component: OMHTProblemsComponent;
  let fixture: ComponentFixture<OMHTProblemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OMHTProblemsComponent ],
      imports: [ TranslateModule.forRoot() ],
      providers: [ TranslateService ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OMHTProblemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
