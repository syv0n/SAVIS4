import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OPHTManualComponent } from './opht.component';

describe('UserManualComponent', () => {
  let component: OPHTManualComponent;
  let fixture: ComponentFixture<OPHTManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OPHTManualComponent ],
      imports: [ TranslateModule.forRoot() ],
      providers: [ TranslateService ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OPHTManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
