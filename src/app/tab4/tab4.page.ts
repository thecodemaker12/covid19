import { from } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../services/language.service';
import { Storage } from '@ionic/storage';
import { ApiService } from '../services/api.service';
import { NavController } from '@ionic/angular';

const API_STORAGE_KEY = 'covid19';
@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  code: any;
  country: any;
  selected = '';
  countrieFlagUrl = 'https://catamphetamine.gitlab.io/country-flag-icons/3x2/';
  constructor(
    private language: LanguageService,
    private navCtrl: NavController,
    private storage: Storage,
    private api: ApiService
    ) {
    this.selected = this.language.selected;
    this.loadData();
  }

  ngOnInit() {
  }

  goSetDefaultCountrie() {
    this.navCtrl.navigateRoot('/countries');
  }

  choseLanguage(lng) {
    this.language.setLanguage(lng);
    this.selected = lng;
  }

  loadData() {
    this.getLocalData(`code`).then(res => {
      if (res === null) {
        this.code = 'SN';
        this.setLocalData(`code`, 'SN');
      } else {
        this.code = res;
      }
    });

    from(this.getLocalData(`countries-list`)).subscribe(resp => {
      const callapi = resp === null ? true : false;
      this.api.getCounties(callapi).subscribe(res => {
        this.country = res.countries.find(c => c.iso2 === this.code);
      });
    });
  }

  private getLocalData(key) {
    return this.storage.get(`${API_STORAGE_KEY}-${key}`);
  }

  private setLocalData(key, data) {
    this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
  }
}
