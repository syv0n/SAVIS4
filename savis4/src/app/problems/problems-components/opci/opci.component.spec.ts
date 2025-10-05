import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OPCIProblemsComponent } from './opci.component';

describe('ProblemsComponent', () => {
  let component: OPCIProblemsComponent;
  let fixture: ComponentFixture<OPCIProblemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OPCIProblemsComponent ],
      imports: [ TranslateModule.forRoot() ],
      providers: [ TranslateService ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OPCIProblemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
