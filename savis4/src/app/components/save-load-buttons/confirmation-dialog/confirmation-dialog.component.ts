import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    public dialog: MatDialog
    ) { }

  onNoClick(): void {
    this.dialogRef.close(false)
  }

  onYesClick(): void {
    this.dialogRef.close(true)
  }

}
