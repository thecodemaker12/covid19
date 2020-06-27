import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { from } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

const API_STORAGE_KEY = 'covid19';
@Component({
  selector: 'app-countries',
  templateUrl: './countries.page.html',
  styleUrls: ['./countries.page.scss']
})
export class CountriesPage implements OnInit {
  countries: any[];
  tmpCountries: any[];
  countrieFlagUrl = 'https://catamphetamine.gitlab.io/country-flag-icons/3x2/';
  constructor(
    private translate: TranslateService,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private storage: Storage
  ) {}

  ngOnInit() {
    from(this.getLocalData(`countries-list`)).subscribe(res => {
      this.countries = res.countries;
      this.tmpCountries = res.countries;
    });
  }

  goBack() {
    this.navCtrl.navigateRoot('/tabs/tab1');
  }

  filter(e) {
    const keyword = e.target.value.trim();
    if (keyword.length > 0) {
      this.countries = this.tmpCountries.filter(c => {
        return c.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
      });
    } else {
      this.countries = this.tmpCountries;
    }
  }

  choseCountry(country) {
    const countries = [];
    from(this.getLocalData(`countries-data`)).subscribe((res) => {
      res.forEach(cntr => {
        if (cntr.iso2 && cntr.iso2 === country.iso2) {
          countries.push(cntr);
        }
      });
    });
    setTimeout(() => {
      if (countries.length > 1) {
        console.log(countries);
      } else {
        this.presentAlert(country);
      }
    }, 300);
  }

  async presentAlert(country) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmation',
      message: this.translate.instant('COUNTRIES.message', {country: country.name}),
      buttons: [
        { text: this.translate.instant('COUNTRIES.textCancel'), role: 'cancel', handler: () => {} },
        {
          text: this.translate.instant('COUNTRIES.textValidate'),
          handler: () => {
            if (country.iso2) {
              this.setLocalData(`code`, country.iso2);
              this.goBack();
            } else {
              console.log(this.translate.instant('COUNTRIES.nodata'));
            }
          }
        }
      ]
    });
    await alert.present();
  }

  private setLocalData(key, data) {
    this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
  }

  private getLocalData(key) {
    return this.storage.get(`${API_STORAGE_KEY}-${key}`);
  }
}
