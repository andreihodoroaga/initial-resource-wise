import { Routes } from '@angular/router';
import { DonorPageComponent } from './components/donor-page/donor-page.component';
import { HomeComponent } from './components/home/home.component';
import { MapComponent } from './components/map/map.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'donor',
    component: DonorPageComponent
  },
  {
    path: 'map',
    component: MapComponent,
  }
];
