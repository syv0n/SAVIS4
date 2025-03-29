import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{

  isAuth:  boolean = false;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private translate: TranslateService
  ) { }

  /*signOut(){
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login'])
    })
  }*/

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      this.isAuth = !!user;
    });
  }

  signOut() {
    this.afAuth.signOut().then(() => {
      this.isAuth = false;
      this.router.navigate(['/login'])
    })
  }

  continueAsGuest() {
    this.isAuth = false;
    this.router.navigate(['/login'])
  }

}
