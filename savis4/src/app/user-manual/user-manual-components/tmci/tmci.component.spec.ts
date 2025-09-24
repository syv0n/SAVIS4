import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TMCIManualComponent } from './tmci.component';

describe('UserManualComponent', () => {
  let component: TMCIManualComponent;
  let fixture: ComponentFixture<TMCIManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TMCIManualComponent ],
      imports: [ TranslateModule.forRoot() ],
      providers: [ TranslateService ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TMCIManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
