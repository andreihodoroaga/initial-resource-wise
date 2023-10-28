import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientJsonpModule,
  HttpClientModule,
} from '@angular/common/http';
import { Component } from '@angular/core';
import { GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Observable, catchError, map, of } from 'rxjs';
import { GOOGLE_MAPS_API_KEY } from 'src/constants';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [
    HttpClientModule,
    HttpClientJsonpModule,
    CommonModule,
    GoogleMapsModule,
  ],
})
export class MapComponent {
  apiLoaded$: Observable<boolean>;
  locationCoordsLatitude!: number;
  locationCoordsLongitude!: number;

  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions: google.maps.LatLngLiteral[] = [
    {lat: 44.430587023238495, lng: 26.052819192409515},
    {lat: 44.42593134673107, lng: 26.041775129210034},
    {lat: 44.42393915583195, lng: 26.05698799248034},
    {lat: 44.439752051705966, lng: 26.077930680468622},
    {lat: 44.41964809736245, lng: 26.079647294238153},
    {lat: 44.4321920290114, lng: 26.030252680424688},
    {lat: 44.4341532739055, lng: 26.047075495366094},
    {lat: 44.43047588573741, lng: 26.119173273686407},
    {lat: 44.41772581526659, lng: 26.120718226078985}
  ];

  public markers: any;
  public lastDonation!: any;

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((location) => {
        this.locationCoordsLatitude = location.coords.latitude;
        this.locationCoordsLongitude = location.coords.longitude;
      });
    }
  }

  // addMarker(event: google.maps.MapMouseEvent) {
  //   this.markerPositions.push(event.latLng!.toJSON());
  //   // console.log(event.latLng!.toJSON());
  // }

  public openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
  }

  constructor(httpClient: HttpClient) {
    this.getUserLocation();

    if (localStorage.getItem("donations")) {
      const donations = JSON.parse(localStorage.getItem("donations")!);
      this.lastDonation = donations[donations.length - 1];
    }

    this.markers = [
      {name: 'McDonalds', position: this.markerPositions[0], donation: this.lastDonation},
       {name: 'Restaurant Lebada', position: this.markerPositions[1], donation: {imageName: "beneficiary.jpg", description: "Restaurant Lebada"} },
      {name: 'Matei Cosmin', position: this.markerPositions[2]},
      {name: 'Maria Ioana', position: this.markerPositions[3]},
      {name: 'Tudor Popescu', position: this.markerPositions[4]},
      {name: 'KFC', position: this.markerPositions[5]},
      {name: 'Covrigarie Luca', position: this.markerPositions[6]},
      {name: 'Andreea Cantemir', position: this.markerPositions[7]},
      {name: 'Simona Dumitrescu', position: this.markerPositions[8]},

    ]

    this.apiLoaded$ = httpClient
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`,
        'callback'
      )
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }



}
