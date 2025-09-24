import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DotPlotManualComponent } from './dot-plot.component';

describe('UserManualComponent', () => {
  let component: DotPlotManualComponent;
  let fixture: ComponentFixture<DotPlotManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DotPlotManualComponent ],
      imports: [ TranslateModule.forRoot() ],
      providers: [ TranslateService ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DotPlotManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
