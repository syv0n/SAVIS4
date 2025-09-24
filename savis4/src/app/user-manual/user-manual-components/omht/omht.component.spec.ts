import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OMHTManualComponent } from './omht.component';

describe('UserManualComponent', () => {
  let component: OMHTManualComponent;
  let fixture: ComponentFixture<OMHTManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OMHTManualComponent ],
      imports: [ TranslateModule.forRoot() ],
      providers: [ TranslateService ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OMHTManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
