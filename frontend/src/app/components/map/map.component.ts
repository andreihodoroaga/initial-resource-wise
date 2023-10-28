import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientJsonpModule,
  HttpClientModule,
} from '@angular/common/http';
import { AfterViewInit, Component, NgZone, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMapsModule, MapDirectionsRenderer, MapDirectionsService, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Observable, catchError, map, of } from 'rxjs';
import { API_URL, GOOGLE_MAPS_API_KEY } from 'src/constants';
import { MAPS_OPTIONS } from './maps-options';
import { AngularMaterialModule } from 'src/app/app-material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AchievementComponent } from '../achievement/achievement.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../confirm/confirm.component';
import { DomSanitizer } from '@angular/platform-browser';

export interface DialogData {
  animal: string;
  name: string;
}

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
    AngularMaterialModule,
  ],
})
export class MapComponent implements AfterViewInit{
  @ViewChild(GoogleMap)
  mapElement!: GoogleMap;

  @ViewChild('googleMap') gmapElement: any;
  newMap!: google.maps.Map;

  @ViewChild(MapDirectionsRenderer)
  mapDirectionsRenderer!: MapDirectionsRenderer;


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

  iconUrl = "../../../assets/images/home.png";

  public markers: any;
  public mcMarker: any;
  public mcImage: any;
  public lastDonation!: any;
  public userLocation!: { lat: number, lng: number; };

  public mapsOptions = MAPS_OPTIONS;

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((location) => {
        this.locationCoordsLatitude = location.coords.latitude;
        this.locationCoordsLongitude = location.coords.longitude;
        this.userLocation = {
          lat: location.coords.latitude,
          lng: location.coords.longitude
        }
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

  constructor(private httpClient: HttpClient, private _snackBar: MatSnackBar, public dialog: MatDialog, private mapDirectionsService: MapDirectionsService, private _ngZone: NgZone, private sanitizer: DomSanitizer) {
    this.getUserLocation();

    this.markers = JSON.parse(localStorage.getItem('markers')!)

    if (localStorage.getItem("donations")) {
      const donations = JSON.parse(localStorage.getItem("donations")!);

      this.lastDonation = donations[donations.length - 1];
      this.getImageByFilename(this.lastDonation.imageName).subscribe(blob => {
        const objectURL = URL.createObjectURL(blob);
        this.mcImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      })
      if (this.markers[0].name !== 'McDonalds') {
        this.markers.unshift({name: 'McDonalds', position: this.markerPositions[0], donation: null})
      }
      this.markers[0].donation = this.lastDonation;
    }


    // this.markers = [
    //   {name: 'McDonalds', position: this.markerPositions[0], donation: null},
    //   {name: 'Restaurant Lebada', position: this.markerPositions[1], donation: {imageName: "snitelLebada.jpg", description: "snitel de pui cu cartofi"} },
    //   {name: 'Matei Cosmin', position: this.markerPositions[2], donation: {imageName: "bananeMateiCosmin.jpg", description: "5 banane"}},
    //   {name: 'Maria Ioana', position: this.markerPositions[3], donation: {imageName: "papanasiMariaIoana.jpg", description: "papanasi"}},
    //   {name: 'Tudor Popescu', position: this.markerPositions[4], donation: {imageName: "sarmaleTudorPopescu.jpg", description: "sarmale"}},
    //   {name: 'KFC', position: this.markerPositions[5], donation: {imageName: "kfc.png", description: "7 wings bucket"}},
    //   {name: 'Covrigarie Luca', position: this.markerPositions[6], donation: {imageName: "covrigiluca.jpg", description: "covrigi mixt"}},
    //   {name: 'Andreea Cantemir', position: this.markerPositions[7], donation: {imageName: "clatiteAndreeaCantemir.jpg", description: "clatite proaspete cu nutella si gem de fructe de padure"}},
    //   {name: 'Simona Dumitrescu', position: this.markerPositions[8], donation: {imageName: "pereSimonaDumitrescu.jpg", description: "pere de casa"}},

    // ]

    // localStorage.setItem('markers', JSON.stringify(this.markers));


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

  takeDonation(markerName: string, markerPosition: any) {
    setTimeout(() => {
      this.openDialog(markerName, markerPosition);
    }, 200)
  }

  openDialog(markerName: string, markerPosition: any): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {name: 'aba', animal: 'this.animal'},
    });

    dialogRef.afterClosed().subscribe(takeDonationItem => {
      if (takeDonationItem) {
        this.markers = this.markers.filter((marker: any) => marker.name !== markerName)
        localStorage.setItem('markers', JSON.stringify(this.markers));

        console.log(this.mapDirectionsRenderer)
        // drive to destionation
        const directionsDisplay = new google.maps.DirectionsRenderer;
        directionsDisplay.setMap(this.mapElement.googleMap!);

        this._ngZone.run(() => {
          const request = {
            origin: this.userLocation,
            destination: markerPosition,
            travelMode: google.maps.TravelMode.WALKING
          };
          this.mapDirectionsService.route(request).subscribe(({result, status}) => {
            if (status == 'OK') {
              console.log(result);
              directionsDisplay.setDirections(result!);
            }
          });
        })
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      console.log(this.mapElement)
    }, 1000)

  }

  getImageByFilename(filename: string) {
    return this.httpClient.get(`${API_URL}/images/${filename}`, {
      responseType: 'blob', // Set the response type to 'blob' to handle image data
    });
  }

}
