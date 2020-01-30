import { Component, ViewChild, NgZone, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';
import { DetailsPage } from '../details/details';

/**
 * Generated class for the SchoolPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-school',
  templateUrl: 'school.html',
})
export class SchoolPage {

results:any;

  constructor(public navCtrl: NavController, public connectivityService:ConnectivityServiceProvider, public navParams: NavParams, private ngZone: NgZone, private geolocation : Geolocation) {
    this.getserviceprovider();
  }

  ionViewDidLoad() {

  }

  getserviceprovider(){
    this.connectivityService.getserviceprovider().then((data) => {
       console.log(data);
       this.results = data;
     });
  }

  getdetails(result){
    this.navCtrl.setRoot(DetailsPage, {
      details: result
    });
  }

}
