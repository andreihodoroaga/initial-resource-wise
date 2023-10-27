import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/constants';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapComponent } from './components/map/map.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, GoogleMapsModule, MapComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private httpClient: HttpClient) {
    this.httpClient.get(API_URL).subscribe(res => {
      console.log(res);
    })
  }
}
