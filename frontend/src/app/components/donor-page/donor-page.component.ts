import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AchievementComponent } from '../achievement/achievement.component';

@Component({
  selector: 'app-donor-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './donor-page.component.html',
  styleUrls: ['./donor-page.component.scss']
})
export class DonorPageComponent {
  donorForm = this.formBuilder.group({
    image: '',
    description: ''
  });

  numberOfBadges = 0;

  constructor(private formBuilder: FormBuilder, private _snackBar: MatSnackBar) {
    const nrBadgesLocalSt = localStorage.getItem('donatorBadges');
    this.numberOfBadges = nrBadgesLocalSt ? parseInt(JSON.parse(nrBadgesLocalSt)) : 0;
  }

  onSubmit() {
    if (this.donorForm.invalid) {
      return;
    }

    const existingDonationsInStorage = localStorage.getItem('donations');
    const existingDonations = existingDonationsInStorage ? JSON.parse(existingDonationsInStorage) : [];

    existingDonations.push({
      imageName: this.donorForm.value.image!.split('\\').pop(),
      description: this.donorForm.value.description,
    })

    localStorage.setItem('donations', JSON.stringify(existingDonations))

    this.numberOfBadges += 1;
    localStorage.setItem('donatorBadges', JSON.stringify(this.numberOfBadges));

    if (this.numberOfBadges === 1) {
      setTimeout(() => {
        this._snackBar.openFromComponent(AchievementComponent, { panelClass: ['custom-snackbar'] });
      }, 300)

      setTimeout(() => {
        this._snackBar.dismiss();
      }, 4000)
    }

    this.donorForm.reset();
  }
}
