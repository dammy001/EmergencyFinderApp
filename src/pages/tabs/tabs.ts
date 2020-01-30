import { Component } from '@angular/core';
import { IonicPage,NavController, NavParams} from 'ionic-angular';
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';
@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  restaurant = "RestaurantsPage";
  mechanic = "MechanicPage";
  hospital = "HospitalPage";
  pharmacy = "PharmacyPage";
  church="ChurchPage";
  school="SchoolPage";
 // gas_station="GasStationPage";
  token:any;
  user:any;

  selected_place:any;
  rating:any=0;
  showFooter:boolean=true; //show and hide footer using the Fab Icon
  constructor(public connectionService:ConnectivityServiceProvider, public navCtlr:NavController, public navParams:NavParams) {

    this.user = this.navParams.get('user');
    this.token = this.navParams.get('token');

     this.connectionService.selectedPlaceObserve$.subscribe(place=>{
       this.selected_place=place;

       if(this.selected_place)
       this.rating=this.selected_place.rating;
       //this.rating=4;
     })
  }



   showPlaceDetailsPage(place:any){

    this.navCtlr.push('PlaceDetailsPage',{place:place, user:this.user, token:this.token});

   }


 showDirectionPage(place:any){

   this.navCtlr.push('PlaceDirectionPage',{direction:place});

}

/*
   @Description:Handle Fab Icon click
*/
   handleFabEvent(){
       this.showFooter==this.showFooter;
   }
}
