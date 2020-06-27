import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { from } from 'rxjs';
import { IonContent, IonInfiniteScroll } from '@ionic/angular';
import * as moment from 'moment';

const API_STORAGE_KEY = 'covid19';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  @ViewChild(IonContent, { static: true }) content: IonContent;
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll: IonInfiniteScroll;

  lastUpdated: any;
  countries = [];
  tmpCountries: any[];
  countrieFlagUrl = 'https://catamphetamine.gitlab.io/country-flag-icons/3x2/';
  constructor(private storage: Storage) {
    from(this.getLocalData(`countries-data`)).subscribe(res => {
      const count = this.countries.length + 40;
      this.countries = this.chargeData(res, count);
      this.tmpCountries = res;
    });

    from(this.getLocalData(`mondial`)).subscribe(res => {
      this.lastUpdated = res.lastUpdate;
    });
  }

  filter(e) {
    const keyword = e.target.value.trim();
    if (keyword.length > 0) {
      this.countries = this.tmpCountries.filter(c => {
        return c.combinedKey.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
      });
    } else {
      this.countries = [];
      this.countries = this.chargeData(this.tmpCountries, 40);
    }
  }

  formatDate(date) {
    return moment(date).format('LLLL');
  }

  ScrollToTop() {
    this.content.scrollToTop(1000);
  }

  loadData(event) {
    setTimeout(() => {
      const count = this.countries.length + 40;
      this.countries = this.chargeData(this.tmpCountries, count);
      event.target.complete();
      if (this.countries.length === this.tmpCountries.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  chargeData(data, count) {
    const countries = [];
    let i = 0;
    while (countries.length !== count) {
      countries.push(data[i]);
      i++;
    }
    return countries;
  }

  private getLocalData(key) {
    return this.storage.get(`${API_STORAGE_KEY}-${key}`);
  }
}
