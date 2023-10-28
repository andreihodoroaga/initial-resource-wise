import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-donor-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './donor-page.component.html',
  styleUrls: ['./donor-page.component.scss']
})
export class DonorPageComponent {
  donorForm = this.formBuilder.group({
    image: '',
    description: ''
  });

  constructor(private formBuilder: FormBuilder) {

  }

  onSubmit() {
    console.log(this.donorForm.value)
  }
}
