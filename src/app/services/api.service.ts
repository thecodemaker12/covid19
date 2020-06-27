import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

const API_STORAGE_KEY = 'covid19';
const API_URL = 'https://covid19.mathdro.id/api';
@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient, private storage: Storage) {}

  getData(refresh: boolean = false): Observable<any> {
    if (!refresh) {
      return from(this.getLocalData(`mondial`));
    } else {
      return this.http.get(`${API_URL}`).pipe(
        map((res) => res),
        tap((res) => {
          this.setLocalData(`mondial`, res);
        })
      );
    }
  }

  getCountryData(code, refresh: boolean = false): Observable<any> {
    if (!refresh) {
      return from(this.getLocalData(`country-${code}`));
    } else {
      return this.http.get(`${API_URL}/countries/${code}/confirmed`).pipe(
        map((res) => res),
        tap((res) => {
          this.setLocalData(`country-${code}`, res);
        })
      );
    }
  }

  getCountiesData(refresh: boolean = false): Observable<any> {
    if (!refresh) {
      return from(this.getLocalData(`countries-data`));
    } else {
      return this.http.get(`${API_URL}/confirmed`).pipe(
        map((res) => res),
        tap((res) => {
          this.setLocalData(`countries-data`, res);
        })
      );
    }
  }

  getCounties(refresh: boolean = false): Observable<any> {
    if (!refresh) {
      return from(this.getLocalData(`countries-list`));
    } else {
      return this.http.get(`${API_URL}/countries`).pipe(
        map((res) => res),
        tap((res) => {
          this.setLocalData(`countries-list`, res);
        })
      );
    }
  }

  getDaily(date, pays, refresh: boolean = false): Observable<any> {
    if (!refresh) {
      return from(this.getLocalData(`${pays}-day-${date}`));
    } else {
      return this.http.get(`${API_URL}/daily/${date}`).pipe(
        map((res) => res),
        tap((res) => {
          const find = res.find(r => r.countryRegion === pays);
          this.setLocalData(`${pays}-day-${date}`, find);
        })
      );
    }
  }

  private setLocalData(key, data) {
    this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
  }

  private getLocalData(key) {
    return this.storage.get(`${API_STORAGE_KEY}-${key}`);
  }
}
