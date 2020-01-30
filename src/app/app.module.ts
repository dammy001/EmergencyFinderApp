import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, ViewController, ModalController, NavController } from 'ionic-angular';
import { MyApp } from './app.component';

import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { GoogleMaps } from '@ionic-native/google-maps';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Diagnostic } from '@ionic-native/diagnostic';
import { HttpModule } from '@angular/http';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BrowserTab } from '@ionic-native/browser-tab';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';

import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { WelcomePage} from '../pages/welcome/welcome';
import { SplashPage } from '../pages/splash/splash';
import { RegisterPage } from '../pages/register/register';
import { ServiceproviderPage} from '../pages/serviceprovider/serviceprovider';
import { ServiceproviderprofilePage } from '../pages/serviceproviderprofile/serviceproviderprofile';
import { DetailsPage } from '../pages/details/details';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ConnectivityServiceProvider } from '../providers/connectivity-service/connectivity-service';
import { LocationHandlerProvider } from '../providers/locationhandler/locationhandler';
import { SharedModule } from './shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FavouriteplaceProvider } from '../providers/favouriteplace/favouriteplace';
//import { HttpModule, XHRBackend, RequestOptions, Http } from '@angular/http';


const firebaseConfig = {
  apiKey: 'AIzaSyAsRpY7JIvRnq4qp-ySkZu6zSXS3kT7UfU',
  authDomain: 'ionic-4-firebase-login-6eaea.firebaseapp.com',
  databaseURL: 'https://ionic-4-firebase-login-6eaea.firebaseio.com',
  projectId: 'ionic-4-firebase-login-6eaea',
  storageBucket: 'ionic-4-firebase-login-6eaea.appspot.com',
  messagingSenderId: '174279125223',
  appId: '1:174279125223:web:fffd97dfca935f6a'
};


@NgModule({

  declarations: [
    MyApp,
   // AboutPage,
    ContactPage,
    HomePage,
  // RestaurantsPage,
    LoginPage,
    WelcomePage,
    RegisterPage,
    ServiceproviderPage,
    ServiceproviderprofilePage,
   // SupermarketPage,
    SplashPage,
    DetailsPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    SharedModule,
    HttpClientModule,
    SuperTabsModule.forRoot(),
    IonicModule.forRoot(MyApp),
   // AngularFireModule.initializeApp(firebaseConfig),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
   // AboutPage,
    ContactPage,
    HomePage,
    RegisterPage,
    ServiceproviderPage,
    ServiceproviderprofilePage,
   // RestaurantsPage,
    LoginPage,
    WelcomePage,
   // SupermarketPage,
    SplashPage,
    DetailsPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    File,
    Transfer,
    GoogleMaps,
    Network,
    AndroidPermissions,
    LocationAccuracy,
    Diagnostic,
    SocialSharing,
    BrowserTab,
    InAppBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConnectivityServiceProvider,
    LocationHandlerProvider,
    FavouriteplaceProvider,
   // AngularFireAuth
  ]
})
export class AppModule {}
