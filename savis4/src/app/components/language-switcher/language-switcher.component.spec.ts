import { ComponentFixture, TestBed } from '@angular/core/testing'
import { of } from 'rxjs'
import { LanguageSwitcherComponent } from './language-switcher.component'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

describe('LanguageSwitcherComponent', () => {
  let component: LanguageSwitcherComponent
  let fixture: ComponentFixture<LanguageSwitcherComponent>
  let translateService: TranslateService

  beforeEach(async () => {
    const translateServiceMock = {
      use: jest.fn(),
      get: jest.fn((key) => of(key)),
      setDefaultLang: jest.fn(),
      onLangChange: of({ lang: 'en' }),
      currentLang: 'en'
    }

    await TestBed.configureTestingModule({
      declarations: [ LanguageSwitcherComponent, MockTranslatePipe ],
      imports: [ TranslateModule.forRoot() ],
      providers: [
        { provide: TranslateService, useValue: translateServiceMock }
      ]
    })
    .compileComponents()

    translateService = TestBed.inject(TranslateService)
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSwitcherComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should switch language', () => {
    const event = { target: { checked: true } } as unknown as Event
    component.switchLanguage(event)
    expect(translateService.use).toHaveBeenCalledWith('es')
    expect(localStorage.getItem('lang')).toEqual('es')
  })

  it('should switch language to Spanish when checked', () => {
    const event = { target: { checked: true } } as unknown as Event
    component.switchLanguage(event)

    expect(translateService.use).toHaveBeenCalledWith('es')

    expect(localStorage.getItem('lang')).toEqual('es')
  })

  it('should switch language to English when not checked', () => {
    const event = { target: { checked: false } } as unknown as Event
    component.switchLanguage(event)

    expect(translateService.use).toHaveBeenCalledWith('en')

    expect(localStorage.getItem('lang')).toEqual('en')
  })
})