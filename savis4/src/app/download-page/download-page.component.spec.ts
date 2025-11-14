import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DownloadPageComponent } from './download-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DownloadPageComponent', () => {
  let component: DownloadPageComponent;
  let fixture: ComponentFixture<DownloadPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownloadPageComponent],
      imports: [TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

