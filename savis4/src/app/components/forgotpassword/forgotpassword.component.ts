import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailValidator } from '../signup/signup.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  forgotPasswordForm!: FormGroup
  successMessage!: string
  errorMessage!: string

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required], [EmailValidator.valid]]
    })
  }

  onSubmit(){
    if(this.forgotPasswordForm.valid){
      const { email } = this.forgotPasswordForm.value

      this.afAuth.sendPasswordResetEmail(email).then(() => {
        this.successMessage = 'Password reset email sent, please check your email. You will be redirected to the login page in 5 seconds.'
        setTimeout(() => {
          this.router.navigate(['/login'])
        }, 5000)
      }).catch((error) => {
        this.errorMessage = error.message
      })
    }
  }

  validateAllFormFields(formGroup:FormGroup){
    Object.keys(formGroup.controls).forEach(field=>{
      const control = formGroup.get(field)
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true })
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control)
      }
    })
  }

}
