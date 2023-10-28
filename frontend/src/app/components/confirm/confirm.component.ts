import { Component, Inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { AngularMaterialModule } from "src/app/app-material.module";
import { DialogData } from "../map/map.component";

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'confirm.component.html',
  standalone: true,
  imports: [AngularMaterialModule, FormsModule],
})
export class ConfirmComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
