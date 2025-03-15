import { Component, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent implements OnInit{
  checked = false

  constructor(
    public translate: TranslateService
  ) 
  {
    translate.setDefaultLang('en')
    const savedLang = localStorage.getItem('lang')
    const initialLang = savedLang ? savedLang : 'en'
    translate.use(initialLang)
    this.checked = initialLang === 'es'
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.checked = event.lang === 'es'
      localStorage.setItem('lang', event.lang)
    })
  }

  ngOnInit(): void {
    this.checked = this.translate.currentLang === 'es'
  }

  switchLanguage(event: Event) {
    const target = event.target as HTMLInputElement
    const newLang = target.checked ? 'es' : 'en'
    this.translate.use(target.checked ? 'es' : 'en')
    localStorage.setItem('lang', newLang)
  }
}
