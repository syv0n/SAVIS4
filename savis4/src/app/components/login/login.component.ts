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

    })
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

}
