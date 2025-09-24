import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OPCIManualComponent } from './opci.component';

describe('UserManualComponent', () => {
  let component: OPCIManualComponent;
  let fixture: ComponentFixture<OPCIManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OPCIManualComponent ],
      imports: [ TranslateModule.forRoot() ],
      providers: [ TranslateService ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OPCIManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
