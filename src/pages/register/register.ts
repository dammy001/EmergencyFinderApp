import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';
//import * as firebase from 'firebase/app';
//import { AngularFireAuth } from 'angularfire2/auth';
import {LocationHandlerProvider} from '../../providers/locationhandler/locationhandler';
import { Diagnostic } from '@ionic-native/diagnostic';
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  account: any;
  message:any;
  offline_dialog:boolean=false;
  @ViewChild('name') name;
  @ViewChild('email') email;
  @ViewChild('password') password;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  //  private fire: AngularFireAuth,
    public alertCtrl: AlertController,
     public loading: LoadingController,
     public formBuilder: FormBuilder,
     public menu: MenuController,
     public toastCtrl: ToastController,
     public locationhandler: LocationHandlerProvider,
     public connectivityService: ConnectivityServiceProvider,
     public diagnostic: Diagnostic,) {
    this.account = formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*') ])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.maxLength(15), Validators.pattern('[a-zA-Z0-9 ]*') ])]
    });

 this.menu.swipeEnable(false);
 this.checkOnline();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  checkOnline(){
    if(this.connectivityService.isOnline()){
      this.enableConnection();
    }
    else {
      this.disableConnection();
    }

  }

    // login and go to home page
    register() {

      if(!this.account.valid){
        return false;
    }
    else{
        let credentials = {
          name: this.name.value,
          email: this.email.value,
          password: this.password.value
        };

       const loader = this.loading.create({
        content: "Please Wait....",
        duration: 3000
      });

     // let params = JSON.stringify(credentials);

      loader.onDidDismiss(() => {
        this.connectivityService.register(credentials).then((data) => {
          this.message = data.message;

            const alert = this.alertCtrl.create({
              title: 'notification',
              subTitle: data.message,
              buttons: ['OK']
              });
              alert.present();
              this.navCtrl.setRoot(LoginPage);

        });
      });
      loader.present();
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



  login() {
    this.navCtrl.setRoot(LoginPage);
  }

}
