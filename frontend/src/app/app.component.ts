import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  API_URL = "http://127.0.0.1:5000/";

  constructor(private httpClient: HttpClient) {
    this.httpClient.get(this.API_URL).subscribe(res => {
      console.log(res);
    })
  }
}
