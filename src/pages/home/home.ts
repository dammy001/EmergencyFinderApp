import { Component,ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { LoginPage } from '../login/login';
import { googlemaps } from 'googlemaps';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationHandlerProvider } from '../../providers/locationhandler/locationhandler';

//import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
   import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  MarkerOptions,
  Marker,
  CameraPosition
} from "@ionic-native/google-maps";
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

   @ViewChild('map') mapElement: ElementRef;
  //map: GoogleMap;
  map: any;
  mapInitialised: boolean = false;
  map_loaded: boolean = false;
  current_location: any;
  apiKey: any = "AIzaSyATVf1yeihZEnKiDXJKZm4eP0hlgDCohc0";
  place_view_option: string = "map";
  places: any; //Hold an array of nearby services to the user current direction
  current_location_object: any;
  latLng:any;
  //markers:any;
  //mapOptions:any;
  show_map: boolean = true;
  current_window = null;
  selected_place = null;
  offline_dialog:boolean=false;
  /* @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

    latitude: number;
    longitude: number;
    autocompleteService: any;
    placesService: any;
    query: string = '';
    places: any = [];
    searchDisabled: boolean;
    saveDisabled: boolean;
    location: any; */

  constructor(public navCtrl: NavController,
    private locationAccuracy: LocationAccuracy,
    private androidPermissions: AndroidPermissions,
    public alertCtrl: AlertController,
    public geolocation: Geolocation,
    public connectivityService: ConnectivityServiceProvider,
    public zone: NgZone,
     public plt: Platform,
     public googleMaps: GoogleMaps,
     public locationHandler: LocationHandlerProvider,
     public diagnostic: Diagnostic,
     public platform: Platform
     ) {
     // this.renderNearByServices();
  }

   ionViewDidEnter() {
    //start loadinf animation
    this.locationHandler.showLoader("Loading nearby restaurants....");

    //this.renderNearbyServices();
    //check if the user has a enabled location service on
    this.platform.ready().then((readySource) => {

      this.diagnostic.isLocationEnabled().then(
      (isAvailable) => {

       //check if enabled
       if(isAvailable){

           //render the map and nearby services
           this.renderNearByServices();
       }else{

         this.locationHandler.closeLoader();


        //prompt the user to enable the location services
        let location_state=this.locationHandler.enableLocationService();
        setTimeout(() => {
          this.locationHandler.showLoader("Loading nearby restaurants....");
          //render the map and nearby services
          this.renderNearByServices();
        }, 10000);
        if(location_state){


        }
       }
      }).catch( (e) => {

          console.log(e);
          this.locationHandler.closeLoader();
          this.locationHandler.showToastMessage("Unable to check your location setting. Please enable your location, close and try again");
      });


      });


  }


  segmentChanged(event_object) {

    console.log(event_object);
    if (event_object._value === "list") {
      this.show_map = false;
    } else if (event_object._value === "map") {
      this.show_map = true;
    }
  }

  renderNearByServices(){

    this.addConnectivityListeners();

  if(typeof google == "undefined" || typeof google.maps == "undefined"){

    console.log("Google maps JavaScript needs to be loaded.");
    this.disableMap();

    if(this.connectivityService.isOnline()){
      console.log("online, loading map");

      //Load the SDK
      window['mapInit'] = () => {
        this.initMap();
        this.enableMap();
      }

      let script = document.createElement("script");
      script.id = "googleMaps";

      if(this.apiKey){
        script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&libraries=places';
      } else {
        script.src = 'http://maps.google.com/maps/api/js?callback=mapInit&libraries=places';
      }

      document.body.appendChild(script);

    }
  }
  else {

    if(this.connectivityService.isOnline()){
      console.log("showing map");
      this.initMap();
      this.enableMap();
    }
    else {
      console.log("disabling map");
      this.disableMap();
    }

  }

  }
   sortNearbyLocations(place) {

    return parseInt(place.place_distance);
  }


  initMap(){

    let current: any;
    this.mapInitialised = true;

    this.geolocation.getCurrentPosition().then((position) => {

      this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      console.log('latLng',this.latLng);
      let mapOptions = {
        center: this.latLng,
        zoom: 16,
        zoomControl: true,
        fullscreenControl: false,
        gestureHandling: 'auto',
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.current_location = this.latLng;
      //  this.addMarker();

      current = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }

      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: current,
        label: {
          text: "C",
          color: "white",
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: 'blue',
          fillOpacity: .6,
          scale: 20,
          strokeColor: 'white',
          strokeWeight: .5
        }
      });

      //show user current location on map
      let infoWindow = new google.maps.InfoWindow;

      infoWindow.setPosition(current);
      infoWindow.setContent('You are here.');
      infoWindow.open(this.map);
      this.map.setCenter(current);

      let self = this;

      this.getNearbyActivities("restaurant", this.current_location, current);
    });

    this.current_location_object = current;
  }

  /* --------------------Find Nearby Place------------------------

  nearbyPlace(){
    this.loadGoogleMaps();
    this.markers = [];
    let service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch({
              location: this.latLng,
              radius: this.isKM,
              types: [this.isType]
            }, (results, status) => {
                this.callback(results, status);
                console.log(this.callback(results, status));
                //console.log(results.geometry.name);

            });
  }

  callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        this.createMarker(results[i]);
      }
    }
  }

  createMarker(place){
    var placeLoc = place;
    console.log('placeLoc',placeLoc);
    this.markers = new google.maps.Marker({
        map: this.map,
        position: place.geometry.location,
        animation: google.maps.Animation.DROP,

    });

    let infowindow = new google.maps.InfoWindow({
        content : "<h4 style='color:black;'>"+ place.icon + "<br>"+ place.name + "<br>" + place.vicinity + place.ratings +"</h4>" + "<button ion-button full round (click)='getDirection()'>Get Direction</button>"
    });

    google.maps.event.addListener(this.markers, 'click', () => {
      this.zone.run(() => {
       // infowindow.setContent(place.name, place.vicinity);
        infowindow.open(this.map, this.markers);
      });
    });
  } */


  disableMap(){
    console.log("disable map");
    if(this.offline_dialog){

    }else{
      this.offline_dialog=true;
      let title = "Offline Status";
      let message = "You are currently offline.Please connect to the internet to continue";
      this.locationHandler.showSimpleAlertDialog(title, message);
    }
  }

  enableMap(){
    console.log("enable map");
    this.locationHandler.showToastMessage("You are currently online", "bottom", 3000);

  }

  addConnectivityListeners(){

    this.connectivityService.watchOnline().subscribe(() => {

      setTimeout(() => {

        if(typeof google == "undefined" || typeof google.maps == "undefined" || !this.map_loaded){
          this.renderNearByServices();
        }
        else {
          if(!this.mapInitialised){
            this.initMap();
          }

          this.enableMap();
        }

      }, 2000);

    });

    this.connectivityService.watchOffline().subscribe(() => {

      this.disableMap();

    });

  }

  getNearbyActivities(place_type: string, user_current_location: any, current_location): void {


    //build the search nearby request object to be searched
    let request = {
      location: user_current_location,
      radius: '1000',
      type: [place_type]
    };

    let user_location: any = current_location;
    console.log(current_location);

    let nearby_places: any = []; //hold the list of nearby places
    let place_service = new google.maps.places.PlacesService(this.map);
    let map_id = this.map;
    //  let window=this.current_window;
    let selected_place_object = this.selected_place;
    let self = this;
    place_service.nearbySearch(request, (function (results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {

        // console.log(results);
        for (var i = 0; i < results.length; i++) {
          var place = results[i];
          let photo = place.icon;
          if (place.photos) {
            let photos_list = place.photos;
            photo = photos_list[0].getUrl({ 'maxWidth': 35, 'maxHeight': 35 })
          }


          let marker = new google.maps.Marker({
            map: map_id,
            animation: google.maps.Animation.DROP,
            position: place.geometry.location,
            title: place.name,
            label: {
              text: "R",
              color: "white",
            },
            // icon:"https://maps.google.com/mapfiles/ms/icons/pink-dot.png"
          });

          //set custom features to the marker
          //  marker.setLabel("R");

          // check and determine is  a service is still available
          let state_restuarant = "";
          if (place.opening_hours) {

            if (place.opening_hours.open_now) {

              state_restuarant = "Service is currently on and still open";
            } else {
              state_restuarant = "Service has currently closed for the day";
            }
          } else {
            state_restuarant = "Service has currently closed for the day";
          }

          //build the modal details for a clicked place marker
           let cont = "<div class='card'>" +
             "<img src='" + photo + "' alt='' class='place-logo'>" +
            "<h1 class='title-window'>" + place.name + "</h1>" +
            "<p >Located at '<b>" + place.vicinity + "</b></p>" +
            "<p>" + state_restuarant + "</p>" +
            "</div";

          let content = "<div><p> "+"<b>"+place.name+" restaurant</b> located at '"+place.vicinity+"'</p> <br/> <i>'"+state_restuarant+"'</i></div>";
           let infoWindow = new google.maps.InfoWindow({
             content: cont
           });



          let lng = place.geometry.location.lng();
          let lat = place.geometry.location.lat();

          //calculate the distance of this place from that of the user
          let units = 'm';
          let earthRadius = {
            miles: 3958.8,
            m: 6378137
          };

          let R = earthRadius[units];
          let lat1 = user_location.lat;
          let lon1 = user_location.lng;
          let lat2 = lat;
          let lon2 = lng;

          let dLat = (lat2 - lat1) * (Math.PI / 180);
          let dLon = (lon2 - lon1) * (Math.PI / 180);;
          let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1) * (Math.PI / 180)) * Math.cos((lat2) * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
          let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          let d = Math.round((R * c));
          //toFixed(2);


          // get the detail place details
          var placeDetails = {
            placeId: place.place_id
          };
          let selected_place = place;
          let place_rating = 0;
          let place_formatted_address = "";
          let place_formatted_number = "";
          let place_url = "";
          let place_website = "";
          let place_photos=[];

          let getPlaceDetailService = new google.maps.places.PlacesService(map_id);
          getPlaceDetailService.getDetails(placeDetails, (function (place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {

              place_formatted_number = place.international_phone_number;
              place_formatted_address = place.formatted_address;
              place_url = place.url;
              place_website = place.place_website;
              place_photos=place.photos;

              //  console.log("Lat :"+lat +" Log :"+lng);
              //push the places as object to the nearby array
              let place_object = {
                latitude: lat,
                longitude: lng,
                place_name: selected_place.name,
                place_vicinity: selected_place.vicinity,
                place_url: photo,
                place_status: state_restuarant,
                place_distance: d,
                current_location: current_location,
                rating: place.rating,
                place_website: place_website,
                place_map_url: place_url,
                place_address: place_formatted_address,
                place_formatted_number: place_formatted_number,
                place_photos:place_photos

              };
              nearby_places.push(place_object);

              //add a listener of click event for the location markers
              google.maps.event.addListener(marker, 'mouseover', () => {
                //   if (window != null) {
                //     // window.close();
                //   //  this.selected_place=null;
                // }
                // window=infoWindow;
                // this.selected_place=place_object;
                this.setSelectedPlace(place_object);
                // infoWindow.open(map_id, marker);
                // console.log( this.selected_place);
              });

              google.maps.event.addListener(marker, 'click', () => {
                //   if (window != null) {
                //     // window.close();
                //     // selected_place_object=null;
                // }
                // window=infoWindow;
                this.setSelectedPlace(place_object);
                // infoWindow.open(map_id, marker);

                //set the footer place as selected place
                selected_place_object = place_object
              });

            } else {
              console.log("Unable to get place details " + selected_place)
            }

          }).bind(this));









        }

      }

    }).bind(this));
    console.log(nearby_places);

    //update the global places array.
    this.places = nearby_places;
    //stop the loading animation now
    this.locationHandler.closeLoader();
    console.log(this.selected_place);
    //end of forloop of places
    //sort the places in order of closeness
    // let sort_places: any = this.location_handler.calculateNearbyPlacesByApplyHaversine(nearby_places,this.current_location_object);
    // if (sort_places) {


    // }



  }

  setSelectedPlace(place: any) {

    if (place != null)
      this.connectivityService.setSelectedPlace(place);
  }

  handleResultsCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {

      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        console.log(place.name);
        let marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: place.geometry.location
        });
      }
    }

  }

  addMarker(place): void {


    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: place.geometry.location
    });

    // this.markers.push(marker);

  }



  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'No Connection',
      buttons: ['OK']
    });
    alert.present();
  }



   /* addMarker(){
    let marker = new google.maps.Marker({
     map: this.map,
     animation: google.maps.Animation.DROP,
     position: this.map.getCenter(),
     draggable: true

   });

    let content = "<h4 style='color:black'>My Location</h4>";

    this.addInfoWindow(marker, content);

  }


  addInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }
 */


   /* ngAfterViewInit() {
     this.plt.ready().then(() => {
      this.loadMap();

    });

  }

    loadMap(){

    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    }, (err) => {
      console.log(err);
    });

  }

  addMarker(){
    let marker = new google.maps.Marker({
     map: this.map,
     animation: google.maps.Animation.DROP,
     position: this.map.getCenter(),
     draggable: true

   });

    let content = "<h4>My Location</h4>";

    this.addInfoWindow(marker, content);

  }

  addInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  } */

}
