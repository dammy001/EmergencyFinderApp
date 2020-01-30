import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the FavouriteplaceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FavouriteplaceProvider {
  data: any;
  result:any;
  apiUrl = 'http://localhost:8000';

  constructor(public http: Http) {
    this.data = null;
    console.log('Hello FavouriteplaceProvider Provider');
  }

  getUsers() {
    if (this.data) {
      return Promise.resolve(this.data);
    }
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/api/')
      .map(res => res.json())
      .subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

 /*  saveFavouritePlace(place){
    return new Promise(resolve => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post('http://localhost:8000/api/favouriteplace', place, {headers: headers})
        .subscribe(res => {
        console.log(res.json());
      });
    })

  } */

  saveserviceprovider(details){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if(this.result){
      return Promise.resolve(this.result);
    }
    return new Promise(resolve => {

      this.http.post('http://localhost:8000/api/favouriteservice', details, {headers: headers})
    .map(res => res.json())
    .subscribe(data => {
      this.result = data;
      resolve(this.result);
    });
    });

  }


}
