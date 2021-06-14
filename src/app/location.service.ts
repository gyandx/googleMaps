import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})


export class LocationService {
  private geoCoder;

  // used to get the current location by using navigator
  getCurrentPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(currentLocation => {
          resolve(currentLocation?.coords);
        }),
          error => {
            reject(console.log(error));
          }
      }
    });
  }

  // used to get the address by using latitude and longitude
  getAddress(latitude, longitude) {
    this.geoCoder = new google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      this.geoCoder.geocode({'location' : { lat: latitude, lng: longitude }}, (result, status) => {
        if ( status === 'OK'){
          if (result.length){
            resolve(result[0].formatted_address);
          }
        }else{
          reject('No Address Found');
        }
      })
    })
  }
}
