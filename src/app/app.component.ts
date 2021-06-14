import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { LocationService } from './location.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit{
  @ViewChild('search') public searchElement: ElementRef;
  title = 'Angular Google Map';
  latitude: number;
  longitude: number;
  zoom: number = 8;
  infoWindowData: any;
  geoCoder: any;

  constructor(private locationService: LocationService, private mapApiLoader: MapsAPILoader, private ngZone: NgZone){}

  ngOnInit() {
    this.setCurrentLocation();
  }

  // used to initialize the search input after the view get initialized
  ngAfterViewInit() {
    this.mapApiLoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
      let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          // console.log('place', place)
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
          this.getInfoAddress(this.latitude, this.longitude);
        });
      });
    })
  }

  // used to get the current location
  setCurrentLocation() {
    this.locationService.getCurrentPosition().then( res => {
      this.latitude = res.latitude;
      this.longitude = res.longitude;
      this.getInfoAddress(this.latitude, this.longitude);
    })
  }

  // use to get the info address
  getInfoAddress(lat, long){
    this.locationService.getAddress(lat, long).then(res => {
      this.infoWindowData = res;
    })
  }
}
