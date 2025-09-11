import { Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-save-dialog',
  templateUrl: './save-dialog.component.html',
  styleUrls: ['./save-dialog.component.scss'],
})
export class SaveDialogComponent implements OnInit{
  isFileNameUnique:boolean = true
  fileName = new FormControl('')
  wasClosedByButton: boolean = false
  feature: string = ''

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private af: AngularFireAuth,
    private firestore: AngularFirestore,
    ) { this.feature = data.feature}

  ngOnInit(): void {
      this.fileName.valueChanges.subscribe(value => {
        this.checkFileName(value)
      })
  }

  checkFileName(fileName: string): void {
    this.af.authState.pipe(take(1)).subscribe(user => {
      if (user) {
        const userId = user.uid
        this.firestore.collection(`users/${userId}/${this.feature}`, ref => ref.where('fileName', '==', fileName))
          .get()
          .toPromise()
          .then(querySnapshot => {
            this.isFileNameUnique = querySnapshot.empty
          })
          .catch(error => {
            console.error('Error checking file name: ', error)
          })
      }
    })
  }

  onFileNameChange(fileName: string): void {
    this.checkFileName(fileName)
  }
}