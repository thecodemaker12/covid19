import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

const LNG_KEY = 'SELECTED_LANGUAGE';
@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  selected = '';
  constructor(
    private translate: TranslateService,
    private storage: Storage,
  ) { }

  setInitialAppLanguage() {
    const language = this.translate.getBrowserLang();
    this.translate.setDefaultLang(language);

    this.storage.get(LNG_KEY).then(lng => {
      if (lng) {
        this.setLanguage(lng);
        moment.locale(lng);
      } else {
        this.setLanguage('fr');
        moment.locale('fr');
      }
    });
  }

  setLanguage(lng) {
    this.translate.use(lng);
    moment.locale(lng);
    this.selected = lng;
    this.storage.set(LNG_KEY, lng);
  }
}
