import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { SaveDialogComponent } from './save-dialog/save-dialog.component';
import { LoadDialogComponent } from './load-dialog/load-dialog.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { subscribeOn, take } from 'rxjs/operators';

@Component({
  selector: 'app-save-load-buttons',
  templateUrl: './save-load-buttons.component.html',
  styleUrls: ['./save-load-buttons.component.scss'],
})
export class SaveLoadButtonsComponent {
  @Input() data: string
  @Input() feature: string
  fileName: string = ''
  loggedIn: boolean = false
  storedData: any[] = []
  

  constructor(
    private af: AngularFireAuth,
    private firestore: AngularFirestore,
    private translate: TranslateService,
    public dialog: MatDialog
  )
  {
    this.af.authState.subscribe(user => {
      this.loggedIn = !!user
    })
  }

  saveDialog() {
    let dialogRef = this.dialog.open(SaveDialogComponent, {
      width: '400px',
      height: '600px',
      data: {data: this.data, feature: this.feature},
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result.save) {
        this.af.authState.pipe(take(1)).subscribe(user => {
          if (user) {
            const userId = user.uid
            const { save, data, fileName, ...dataToSave } = result
            const { feature, ...dataWithoutFeature } = data
            dataToSave.data = dataWithoutFeature.data
            dataToSave.fileName = fileName
            this.firestore.collection(`users/${userId}/${this.feature}`, ref => ref.where('fileName', '==', dataToSave.fileName))
              .get()
              .toPromise()
              .then(querySnapshot => {
                if (querySnapshot.empty) {
                  this.firestore.collection(`users/${userId}/${this.feature}`).add(dataToSave)
                }
              })
              .catch(error => {
                console.error('Error saving document: ', error)
              })
          }
        })
      }
    })
  }

  loadDialog() {
    this.af.authState.pipe(take(1)).subscribe(user => {
      if (user) {
        const userId = user.uid
        const subscription = this.firestore.collection(`users/${userId}/${this.feature}`).valueChanges().subscribe(data => {
          let dialogRef = this.dialog.open(LoadDialogComponent, {
            width: '600px',
            height: '600px',
            data: { files: data, feature: this.feature},
            disableClose: true
          })

          dialogRef.afterClosed().subscribe(() => {
            subscription.unsubscribe()
          })
        })
      }
    })
  }
}
