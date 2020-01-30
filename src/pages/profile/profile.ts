import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';
import { LoginPage } from '../login/login';

declare var cordova:any;

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  lastImage: string = null;
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public connectivityService : ConnectivityServiceProvider,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public platform: Platform,
    public loadingCtrl: LoadingController) {


    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  logOut(): void {
    const loader = this.loadingCtrl.create({
      content: "Logging out....",
      duration: 3000
    });

    loader.onDidDismiss(() => {
      this.navCtrl.setRoot(LoginPage);
    });
    loader.present();


    /* this.connectivityService.logoutUser().then((data) => {

      this.navCtrl.setRoot(LoginPage);
    }); */
  }
}
