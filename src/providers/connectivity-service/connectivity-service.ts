import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Http, Headers } from '@angular/http';

declare var Connection;

@Injectable()
export class ConnectivityServiceProvider {
  response:any;
  success:any;
  result:any;
  logout:any;
  private selected_place = new BehaviorSubject<any>(null); // true is your initial value
  selectedPlaceObserve$ = this.selected_place.asObservable();

  onDevice: boolean;
  isAndroid: boolean;
  iswebview: boolean;
  constructor(public platform: Platform, public network: Network, public http: Http) {
    console.log('Hello ConnectivityServiceProvider Provider');
    //this.onDevice = this.platform.is('cordova');
    //this.isAndroid = this.platform.is('android');
    //this.iswebview = this.platform.is('pwa');
  }

  isOnline(): boolean {
    if(this.network.type != 'none'){
      return navigator.onLine;
    }
   /*  if(this.onDevice && this.network.type){
      if(this.isAndroid && this.network.type){
        if(this.iswebview && this.network.type){
          return this.network.type != 'none';
        }else{
          return navigator.onLine;
        }

      }else {
        return navigator.onLine;
      }
    } else {
      return navigator.onLine;
    } */
  }

  isOffline(): boolean {
    if(this.onDevice && this.network.type){
      if(this.isAndroid && this.network.type){
        return this.network.type == 'none';
      }else {
        return !navigator.onLine;
      }
    } else {
      return !navigator.onLine;
    }
  }

  watchOnline(): any {
    return this.network.onConnect();
  }

  watchOffline(): any {
    return this.network.onDisconnect();
  }

  setSelectedPlace(value: any) {
    this.selected_place.next(value);
    console.log('isFixed changed', value);
  }

   getSelectedPlace():any {
    return this.selected_place.getValue()
  }

  userlogin(parameters){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if(this.response){
      return Promise.resolve(this.response);
    }
    return new Promise(resolve => {
      this.http.post('http://localhost:8000/api/login', parameters, {headers: headers})
    .map(res => res.json())
    .subscribe(data => {
      this.response = data;
      resolve(this.response);
    });
    });

  }

  serviceproviderlogin(parameters){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if(this.response){
      return Promise.resolve(this.response);
    }
    return new Promise(resolve => {
      this.http.post('http://localhost:8000/api/serviceproviderlogin', parameters, {headers: headers})
    .map(res => res.json())
    .subscribe(data => {
      this.response = data;
      resolve(this.response);
    });
    });

  }

   register(parameters){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if(this.success){
      return Promise.resolve(this.success);
    }
    return new Promise(resolve => {

      this.http.post('http://localhost:8000/api/register', parameters, {headers: headers})
    .map(res => res.json())
    .subscribe(data => {
      this.success = data;
      resolve(this.success);
    });
    });

  }

  logoutUser(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if(this.logout){
      return Promise.resolve(this.logout);
    }
    return new Promise(resolve => {

      this.http.post('http://localhost:8000/api/logout', {headers: headers})
    .map(res => res.json())
    .subscribe(data => {
      this.logout = data;
      resolve(this.logout);
    });
    });

  }

  getserviceprovider(){
    if(this.result){
      return Promise.resolve(this.result);
    }
    return new Promise(resolve => {
      this.http.get('http://localhost:8000/api/getserviceproviders')
      .map(res => res.json())
      .subscribe(data => {
        this.result = data;
        resolve(this.result);
      });
    });
  }
}

