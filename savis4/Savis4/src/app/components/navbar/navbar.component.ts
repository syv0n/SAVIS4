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
  // import icons for dynamic switching on click
  private onDarkMode='assets/light_mode_icon.png';
  private onLightMode='assets/dark_mode_icon.png';
  private calculatorEnabled='assets/calculator_enabled_icon.png';
  private calculatorDisabled='assets/calculator_disabled_icon.png';
  // initialize calculator to disabled
  public calculatorMode=this.calculatorDisabled;
  //initialize to light mode (later changed by local storage)
  public modeIcon=this.onLightMode;
  // variable to show calculator

  isAuth:  boolean = false;
  showCalculator: boolean = false;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      this.isAuth = !!user;
    });
    // check local storage for dark mode or light mode so it doesnt refresh to light mode each time
    let getTheme=JSON.parse(localStorage.getItem('appMode'));
    if(getTheme=="DARK"){
      this.modeIcon=this.onDarkMode;
      document.body.classList.add('darkMode');
    }

  }
// Method called from html component when toggle calc button is clicked
  checkCalculatorMode() {
    this.showCalculator = !this.showCalculator;
    let currentMode;
    let enabledBtn=document.getElementById("calcSwitch");
    document.body.classList.toggle('enableCalculator');
    if(document.body.classList.contains('enableCalculator')) {
      // update calculator mode to enabled
    enabledBtn.setAttribute('src',this.calculatorEnabled);
    enabledBtn.title="Calculator Enabled";
    currentMode = "ENABLED";
    this.showCalculator = true;
    } else {
      // update calculator mode to disabled
      enabledBtn.setAttribute('src',this.calculatorDisabled);
      enabledBtn.title="Calculator Disabled";
      currentMode = "DISABLED";
      this.showCalculator = false;
    }
  }

  checkMode(){
    let mode;
    let darkModeBtn= document.getElementById("modeSwitch");
    document.body.classList.toggle('darkMode');
    if(document.body.classList.contains('darkMode')){
      //update mode to dark mode settings
      darkModeBtn.setAttribute('src',this.onDarkMode);
      darkModeBtn.title="Light Mode";
      mode="DARK";
    } else{
      //update mode to light mode settings
      darkModeBtn.setAttribute('src',this.onLightMode);
      darkModeBtn.title="Dark Mode";
      mode="LIGHT";
    }
    //save current mode state to local storage
    localStorage.setItem('appMode',JSON.stringify(mode));
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
