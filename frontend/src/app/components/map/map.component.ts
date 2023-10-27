import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientJsonpModule,
  HttpClientModule,
} from '@angular/common/http';
import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
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
  markerPositions: google.maps.LatLngLiteral[] = [];

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((location) => {
        this.locationCoordsLatitude = location.coords.latitude;
        this.locationCoordsLongitude = location.coords.longitude;
      });
    }
  }

  addMarker(event: google.maps.MapMouseEvent) {
    this.markerPositions.push(event.latLng!.toJSON());
  }

  constructor(httpClient: HttpClient) {
    this.getUserLocation();

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
