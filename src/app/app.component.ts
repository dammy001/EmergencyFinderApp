import { Component, ViewChild } from '@angular/core';
import { Platform , ModalController, AlertController, Nav, NavController, LoadingController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SplashPage } from '../pages/splash/splash';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { WelcomePage } from '../pages/welcome/welcome';
import { Network } from '@ionic-native/network';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = WelcomePage;
  @ViewChild(Nav) nav: Nav;
  //rootPage: any;
  //rootParams: any;

  menuItems: any[] = [

    {
      name: 'Favorite Locations',
      page: 'FavoritePlacePage',
      icon: 'home'

    },
    {
      name: 'About',
      page: 'AboutPage',
      icon: 'information-circle'
    },
    {
      name: 'Profile',
      page: 'ProfilePage',
      icon: 'person'
    },
    {
      name: 'Settings',
      page: 'SettingsPage',
      icon: 'settings'
    }
  ];

  constructor(public loading: LoadingController, public platform: Platform, public network: Network, public alertCtrl: AlertController, statusBar: StatusBar, splashScreen: SplashScreen, modalCtrl: ModalController) {

    //this.rootPage = this.menuItems[0].page;
    //this.rootParams = this.menuItems[0].params;

    platform.ready().then(() => {
      if (this.network.type == 'none' ) {
        // stuff if disconnected
        const alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'No Internet Connection',
          buttons: ['OK']
        });
        alert.present();

      } else {
        //stuff if connected
        console.log('internet');
      }
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();

     // let splash = modalCtrl.create(SplashPage);
     // splash.present();
     // splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.push(page.page);
    // this.nav.setRoot(page.page, page.params);
  }

    logout(){
      const loader = this.loading.create({
        content: "Please Wait....",
        duration: 3000
      });

      loader.onDidDismiss(() => {
        this.nav.setRoot(LoginPage);
      });

  }

}
