import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'findLanguageFromKey' })
export class FindLanguageFromKeyPipe implements PipeTransform {
  private languages: any = {
    en: { name: 'English' },
    fr: { name: 'Français' },
    de: { name: 'Deutsch' },
    it: { name: 'Italiano' },
    pl: { name: 'Polski' },
    'pt-br': { name: 'Português (Brasil)' },
    ru: { name: 'Русский' },
    ua: { name: 'Українська' }
    // jhipster-needle-i18n-language-key-pipe - JHipster will add/remove languages in this object
  };
  transform(lang: string): string {
    return this.languages[lang].name;
  }
}
