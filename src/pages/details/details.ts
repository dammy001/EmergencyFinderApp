import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { LocationHandlerProvider } from '../../providers/locationhandler/locationhandler';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BrowserTab } from '@ionic-native/browser-tab';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FavouriteplaceProvider } from '../../providers/favouriteplace/favouriteplace';


/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
detail:any;
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public browserTab:BrowserTab,
    public iab:InAppBrowser,
    public social_sharing: SocialSharing,
    public loading: LoadingController,
    public alertCtrl: AlertController,
    public location_handler:LocationHandlerProvider) {
    this.detail = this.navParams.get('details');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsPage');
  }

  savePlace(detail){
    let provider = {
      businessname: detail.businessname,
      fullname: detail.fullname,
      address: detail.street_address,
      state: detail.state,
      businesscategory: detail.business_category,
      contact: detail.contact,
      email: detail.email,
    }
    console.log(provider);
    const loader = this.loading.create({
      content: "Login in progress....",
      duration: 3000
    });

    loader.onDidDismiss(() => {

          const alert = this.alertCtrl.create({
            title: 'notification',
            subTitle: "Service Provider Saved Successfully",
            buttons: ['OK']
            });
            alert.present();

      });

    loader.present();
  }

  sharePlace(detail:any){

     let title = detail.businessname;
    let url = "www.facebook.com/anjorin damilare";
    let description = detail.street_addressdetail.state;
    let news_default_image ="";
    let content = description.concat(" \n\n Shared from Emergency Finder App !");

    this.location_handler.showActionSheeet([
      {


        text: 'Share on Facebook',
        icon: 'logo-facebook',
        handler: () => {

          this.social_sharing.shareViaFacebook(content, news_default_image, url)
        }
      },
      {
        text: 'Share on Whatsapp',
        icon: 'logo-whatsapp',
        handler: () => {
          this.social_sharing.shareViaWhatsApp(content, news_default_image, url);
        }
      },
      {
        text: 'Share on Twitter',
        icon: 'logo-twitter',
        handler: () => {

          this.social_sharing.shareViaTwitter(content, news_default_image, url);
        }
      },
      {
        text: "Share News' Link",
        icon: 'share',
        handler: () => {

          //share the news generally through any sharing appliactions which is supported
          this.social_sharing.share(content, title, null, url);
        }
      },
    ]);
 }

 /*
  @Description:Show direction for the place
 */
showDirection(place:any){

   //this.navCtrl.push('PlaceDirectionPage',{direction:place});
}


}
