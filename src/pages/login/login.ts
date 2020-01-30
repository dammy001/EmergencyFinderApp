import { Component, ViewChild } from '@angular/core';
import { IonicPage, App, NavController, Platform, NavParams, AlertController, LoadingController, MenuController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabsPage } from '../tabs/tabs';
import {RegisterPage} from '../register/register';
//import * as firebase from 'firebase/app';
import {LocationHandlerProvider} from '../../providers/locationhandler/locationhandler';
import { Diagnostic } from '@ionic-native/diagnostic';
//declare var AccountKitPlugin:any;
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';
import { ServiceproviderPage } from '../serviceprovider/serviceprovider';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
 account: any;
 offline_dialog:boolean=false;
 response: any;
 token:any;
 @ViewChild('email') email;
 @ViewChild('password') password;
  constructor(public navCtrl: NavController, public appCtrl: App, public navParams: NavParams,
     public alertCtrl: AlertController,
     public loading: LoadingController,
     public formBuilder: FormBuilder,
     public menu: MenuController,
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
    console.log('ionViewDidLoad LoginPage');
  //  this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }

   // go to register page
   register() {
    this.navCtrl.setRoot(RegisterPage);
  }

  checkOnline(){
  if(this.connectivityService.isOnline()){
    this.enableConnection();
  }
  else {
    this.disableConnection();
  }

}

serviceproviderlogin(){
  this.navCtrl.push(ServiceproviderPage);
}

  // login and go to home page
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
        this.connectivityService.userlogin(parameters).then((data) => {
        console.log(JSON.stringify(data));
        this.token = data.token;
        if(data.token){
          const alert = this.alertCtrl.create({
            title: 'notification',
            subTitle: data.message,
            buttons: ['OK']
            });
            alert.present();

             this.navCtrl.setRoot(TabsPage, {
              user:parameters,
              token: this.token
            });

        }else{
          const alert = this.alertCtrl.create({
            title: 'notification',
            subTitle: data.errorMessage,
            buttons: ['OK']
            });
            alert.present();
        }
      });
      this.navCtrl.setRoot(TabsPage);
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

  forgotPass() {
    let forgot = this.alertCtrl.create({
      title: 'Forgot Password?',
      message: "Enter you email address to send a reset link password.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            console.log('Send clicked');
            let toast = this.toastCtrl.create({
              message: 'Email was sended successfully',
              duration: 3000,
              position: 'top',
              cssClass: 'dark-trans',
              closeButtonText: 'OK',
              showCloseButton: true
            });
            toast.present();
          }
        }
      ]
    });
    forgot.present();
  }

  /* login(){

    this.submitAttempt = true;

        if(!this.loginform.valid){
            return false;
        }
        else {
            console.log("success!");
            const loader = this.loading.create({
          content: "Login in progress...",
          duration: 3000
        });
        loader.present();
        this.navCtrl.push(TabsPage);
        } */
      /* (<any>window)
      .AccountKitPlugin
        .loginWithPhoneNumber({
          useAccessToken: true,
          defaultCountryCode: "IN",
          facebookNotificationsEnabled: true
        }, (successdata) => {
          (<any>window).AccountKitPlugin.getAccount((user) => {
            console.log( JSON.stringify(user) );
            alert(JSON.stringify(user));
          //  this.appCtrl.getRootNav().setRoot(TabsPage);
             this.navCtrl.setRoot(TabsPage).then(() =>{
              this.navCtrl.popToRoot();
          });
            //this.navCtrl.setRoot('TabsPage');
           // this.navCtrl.getRootNav().setRoot(LoginPage);

          })
        }, (err) => {
          alert(err);
        }); */
  //}

  logout(){
    (<any>window).AccountKitPlugin.logout( (user) => {
      this.navCtrl.setRoot('LoginPage');
    });
  }
    /* this.submitAttempt = true;

        if(!this.loginform.valid){
            return false;
        }
        else {
            console.log("success!");
            const loader = this.loading.create({
          content: "Login in progress...",
          duration: 3000
        });
        loader.present();
        this.navCtrl.push(TabsPage);
        } */
  }

