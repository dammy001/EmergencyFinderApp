import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FavouriteplaceProvider } from '../../providers/favouriteplace/favouriteplace';

/**
 * Generated class for the FavoritePlacePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-favorite-place',
  templateUrl: 'favorite-place.html',
})
export class FavoritePlacePage {
users: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public favouriteplace: FavouriteplaceProvider) {
    this.getUsers();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritePlacePage');
  }

  getUsers() {
    this.favouriteplace.getUsers()
    .then(data => {
      this.users = data;
      console.log(this.users);
    });
  }

  viewDetails(users){
    //this.navCtrl('FavoriteDetails')
  }

}
