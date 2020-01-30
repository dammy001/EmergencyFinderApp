import { Component, ViewChild } from '@angular/core';
import { IonicPage, App, NavController, Platform, NavParams, AlertController, LoadingController, MenuController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabsPage } from '../tabs/tabs';
import { BrowserTab } from '@ionic-native/browser-tab';
import { InAppBrowser } from '@ionic-native/in-app-browser';
//import * as firebase from 'firebase/app';
import {LocationHandlerProvider} from '../../providers/locationhandler/locationhandler';
import { Diagnostic } from '@ionic-native/diagnostic';
import {ServiceproviderprofilePage} from '../serviceproviderprofile/serviceproviderprofile'
//declare var AccountKitPlugin:any;
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';

@IonicPage()
@Component({
  selector: 'page-serviceprovider',
  templateUrl: 'serviceprovider.html',
})
export class ServiceproviderPage {
  account: any;
  offline_dialog:boolean=false;
  response: any;
  token:any;
  @ViewChild('email') email;
  @ViewChild('password') password;
  constructor(
    public navCtrl: NavController, public appCtrl: App, public navParams: NavParams,
     public alertCtrl: AlertController,
     public loading: LoadingController,
     public formBuilder: FormBuilder,
     public menu: MenuController,
     public browserTab:BrowserTab,
    public iab:InAppBrowser,
     public toastCtrl: ToastController,
     public locationhandler: LocationHandlerProvider,
     public connectivityService: ConnectivityServiceProvider,
     public diagnostic: Diagnostic,
     public platform: Platform) {
      this.account = formBuilder.group({
        email: ['', Validators.compose([Validators.required, Validators.email])],
        password: ['', Validators.compose([Validators.required, Validators.maxLength(15), Validators.pattern('[a-zA-Z0-9 ]*') ])]
      });

   this.menu.swipeEnable(false);
   this.checkOnline();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceproviderPage');
  }

  register(){

    this.browserTab.isAvailable()
  .then((isAvailable: boolean) => {

    //check if browsertab is supported or available for the device
    if (isAvailable) {

      this.browserTab.openUrl("localhost:8000/serviceprovider/register").then(success => {

        if (success) {
          //this means the browser was successfully open
        }
      });

    } else {
      // open URL with InAppBrowser instead since browsertab not available
      this.iab.create("localhost:8000/serviceprovider/register", "_system", "location=true");
    }
    });
  }

  login() {

    let parameters = {
      email: this.email.value,
      password: this.password.value
    };

    if(!this.account.valid){
      return false;
  }
  else{

     const loader = this.loading.create({
      content: "Login in progress....",
      duration: 3000
    });

    loader.onDidDismiss(() => {
        this.connectivityService.serviceproviderlogin(parameters).then((data) => {
        console.log(JSON.stringify(data));
        this.token = data.user.email;
        if(data.user.email){
          const alert = this.alertCtrl.create({
            title: 'notification',
            subTitle: data.message,
            buttons: ['OK']
            });
            alert.present();

             this.navCtrl.setRoot(ServiceproviderprofilePage, {
              user:parameters,
              token: this.token
            });

        }else{
          const alert = this.alertCtrl.create({
            title: 'notification',
            subTitle: data.errormessage,
            buttons: ['OK']
            });
            alert.present();
        }
      });
      //this.navCtrl.setRoot(ServiceproviderprofilePage);
    });
    loader.present();
  }

  }


  checkOnline(){
    if(this.connectivityService.isOnline()){
      this.enableConnection();
    }
    else {
      this.disableConnection();
    }

  }

  disableConnection(){

    if(this.offline_dialog){

    }else{
      this.offline_dialog=true;
      let title = "Offline Status";
      let message = "You are currently offline.Please connect to the internet to continue";
      this.locationhandler.showSimpleAlertDialog(title, message);
    }
  }

  enableConnection(){
    this.locationhandler.showToastMessage("You are currently online", "bottom", 3000);
  }

}
