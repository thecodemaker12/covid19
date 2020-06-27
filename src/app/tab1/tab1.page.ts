import { from } from 'rxjs';
import { Component, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { Chart } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';

const INETVERVAL = 60;
const API_STORAGE_KEY = 'covid19';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild('barChart', {static: true}) barChart;

  bars: any;
  colorArray: any;

  lastUpdate: any;
  slideOpts2: any;
  slideOpts: any;
  confirmed: any;
  recovered: any;
  current: any;
  deaths: any;

  code: any;
  countrie: any;
  countrieData: any;
  topCountries: any[];
  countrieFlagUrl = 'https://catamphetamine.gitlab.io/country-flag-icons/3x2/';
  constructor(
    private translate: TranslateService,
    private navCtrl: NavController,
    private storage: Storage,
    private api: ApiService,
    ) {
    this.slideOpts2 = {
      observer: true,
      observeParents: true,
      slidesPerView: 3.1
    };
    this.slideOpts = {
      observer: true,
      observeParents: true,
      slidesPerView: 2.7
    };
    this.loadData();
  }

  createBarChart(pays) {
    const day = new Date();
    const days = [];
    const donnees = [];
    for (let i  = 0; i < 7; i++) {
      day.setDate(day.getDate() - 1);
      days.push(this.extractDay(day));
      const d = this.convertDate(day);
      from(this.getLocalData(`${pays}-day-${d}`)).subscribe((resp) => {
        let callapi = resp === null ? true : false;
        if (i === 0 && resp && d !== this.convertDate(resp.lastUpdate)) {
          callapi = true;
        }
        this.api.getDaily(d, pays, callapi).subscribe(res => {
          if (callapi) {
            const find = res.find((r) => r.countryRegion === pays);
            donnees.push(find.confirmed);
          } else if (res) {
            donnees.push(res.confirmed);
          }
          if (donnees.length === 7) {
            donnees.sort().reverse();
            this.bars = new Chart(this.barChart.nativeElement, {
              type: 'line',
              data: {
                labels: days,
                datasets: [{
                  label: this.translate.instant('HOME.diagramTitle'),
                  data: donnees,
                  backgroundColor: 'rgb(0, 0, 0, 0)',
                  borderColor: 'rgb(16, 86, 73)',
                  borderWidth: 2,
                }]
              },
              options: {
                scales: {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true
                    }
                  }]
                }
              }
            });
          }
        });
      });
    }
  }

  extractDay(date) {
    let d = moment(date).format('llll').toString();
    d = d.split(' ')[0];
    return d;
  }

  convertDate(date) {
    const day = moment(date).format().toString();
    return day.slice(0, 10);
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
    setTimeout(() => {
      from(this.getLocalData(`country-${this.code}`)).subscribe(resp => {
        let callapi = resp === null ? true : false;
        if (resp && resp.length === 1) {
          callapi = (new Date().getTime() > resp[0].lastUpdate + (INETVERVAL * 60 * 1000)) ? true : false;
        }
        this.api.getCountryData(this.code, callapi).subscribe(res => {
          this.countrieData = res[0];
        });
      });
    }, 1000);

    from(this.getLocalData(`mondial`)).subscribe(resp => {
      let callapi = resp === null ? true : false;
      if (resp) {
        callapi = new Date().getTime() > new Date(resp.lastUpdate).getTime() + (INETVERVAL * 60 * 1000) ? true : false;
      }
      this.api.getData(callapi).subscribe(res => {
        this.lastUpdate = res.lastUpdate;
        this.confirmed = res.confirmed.value;
        this.recovered = res.recovered.value;
        this.deaths = res.deaths.value;
        this.current = this.confirmed - (this.recovered + this.deaths);
      });
    });

    from(this.getLocalData(`countries-list`)).subscribe(resp => {
      const callapi = resp === null ? true : false;
      this.api.getCounties(callapi).subscribe(res => {
        this.countrie = res.countries.find(c => c.iso2 === this.code);
        this.createBarChart(this.countrie.name);
      });
    });

    from(this.getLocalData(`countries-data`)).subscribe(resp => {
      let callapi = resp === null ? true : false;
      if (resp) {
        callapi = (new Date().getTime() > resp[0].lastUpdate + (INETVERVAL * 60 * 1000)) ? true : false;
      }
      this.api.getCountiesData(callapi).subscribe(res => {
        const countries = [];
        let i = 0;
        while (countries.length !== 5) {
          countries.push(res[i]);
          i++;
        }
        this.topCountries = countries;
      });

      // this.createBarChart('Senegal');
    });
  }

  formatDate(date) {
    return moment(date).format('LLLL');
  }

  goSetDefaultCountrie() {
    this.navCtrl.navigateRoot('/countries');
  }

  voirPlus() {
    this.navCtrl.navigateRoot('/tabs/tab3');
  }

  doRefresh(event) {
    setTimeout(() => {
      this.loadData();
      event.target.complete();
    }, 1000);
  }

  private getLocalData(key) {
    return this.storage.get(`${API_STORAGE_KEY}-${key}`);
  }

  private setLocalData(key, data) {
    this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
  }

}
