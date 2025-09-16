import { Component, OnInit } from '@angular/core';
import{FormBuilder, FormGroup, Validators} from '@angular/forms';
import { FormControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // import icons for dynamic switching on click
  private onDarkMode='assets/light_mode_icon.png';
  private onLightMode='assets/dark_mode_icon.png';
  //initialize to light mode (later changed by local storage)
  public modeIcon=this.onLightMode;

  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    public router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loginForm =this.fb.group({
      username:['',Validators.required],
      password:['',Validators.required]

    });
    // check local storage for dark mode or light mode so it doesnt refresh to light mode each time
    let getTheme=JSON.parse(localStorage.getItem('appMode'));
    if(getTheme=="DARK"){
      this.modeIcon=this.onDarkMode;
      document.body.classList.add('darkMode');
    }
  }
  guestOnSubmit(){
    this.router.navigate(['/homepage']);
  }
  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value; // Destructure email and password from the form value
      this.afAuth.signInWithEmailAndPassword(username, password)
        // .then(userCredential => {
        //   this.router.navigate(['/homepage']);
        // })
        .catch(error => {
          alert('Login failed. Please check your credentials.');
          this.router.navigate(['/login'])
          console.log('invalid')
        });
      
        this.afAuth.onAuthStateChanged(user => {
          if (user) {
            // User is signed in
            this.router.navigate(['/homepage']);
          }
        });
    } else {
      this.validateAllFormFields(this.loginForm);
      alert('Your form is invalid');
      console.log('form invalid')
    }
  }

validateAllFormFields(formGroup:FormGroup){
    Object.keys(formGroup.controls).forEach(field=>{
      const control = formGroup.get(field);
      if(control instanceof FormControl) {
        control?.markAsDirty({onlySelf:true})
      }else if(control instanceof FormGroup){
        this.validateAllFormFields(control)
      }
    })
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
}