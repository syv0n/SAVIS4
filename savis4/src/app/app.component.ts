import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private afAuth: AngularFireAuth) { }

  title = 'Savis3'

  ngOnInit(): void {
    this.afAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        // Check if the session has expired
        const lastActivity = localStorage.getItem('lastActivity');
        if (lastActivity && Date.now() - Number(lastActivity) > 30 * 60 * 1000) {
          // If more than 30 minutes have passed since the last activity, sign out the user
          this.afAuth.signOut()
        } else {
          // Update the timestamp of the last activity
          localStorage.setItem('lastActivity', Date.now().toString())
        }
      })
      .catch((error) => {
        var errorCode = error.code
        var errorMessage = error.message
      });
  }
}
