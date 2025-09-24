import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TMHTManualComponent } from './tmht.component';

describe('UserManualComponent', () => {
  let component: TMHTManualComponent;
  let fixture: ComponentFixture<TMHTManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TMHTManualComponent ],
      imports: [ TranslateModule.forRoot() ],
      providers: [ TranslateService ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TMHTManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
