import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  /**
   * Form Group for controling the form
   */
  signUpForm!: FormGroup;

  /**
   * Error message string holder
   */
  errorMessage!: string;

  successMessage!: string;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router,
    private translate: TranslateService
  ) {}

  /**
   * Creating the form groups for all the required fields
   */
  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required], [EmailValidator.valid]],
      password: ['', [Validators.required], [PasswordValidator.strong]],
      confirmPassword: ['', [Validators.required]],
    }, 
    { validators: PasswordValidator.matchPassword } // Validates that the password and confirmPassword fields match
    );
  }
  guestOnSubmit(){
    this.router.navigate(['/homepage']);
  }

  /**
   * Create the new user if all the fields are valid
   */
  onSignUp() {
    this.errorMessage = ''
    
    if (this.signUpForm.valid) {
      this.afAuth.createUserWithEmailAndPassword(this.signUpForm.value.email, this.signUpForm.value.password).then((userCredential) => {

        // Send email verification
        userCredential.user?.sendEmailVerification().then(() => {
          this.successMessage = 'Please check your email for verification of account creation, you will be redirected to the login page in 5 seconds.'
        }).catch((error) => {
          this.errorMessage = error.message
        })

        setTimeout(() => {
          this.router.navigate(['/login'])
        }, 5000)
        
      }).catch((error) => {
        this.errorMessage = error.message
      })
    }
  }

  /**
   * Validate all the fields
   */
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field)
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true })
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control)
      }
    });
  }

  /**
   * Prevents the user for entering spaces in the password and confirm password fields
   * @param event contains the event to check if the user is entering a space in the password or confirm passworld field
   */
  preventSpaces(event: any): void {
    if(event.target.id === 'password'){
      const input = event.target;
      input.value = input.value.replace(/\s/g, '');
      this.signUpForm.get('password')?.setValue(input.value);
    }

    if(event.target.id === 'confirmPassword'){
      const input = event.target;
      input.value = input.value.replace(/\s/g, '');
      this.signUpForm.get('confirmPassword')?.setValue(input.value);
    }
  }
}

/**
 * Custom Validation interface
 */
export interface ValidationResult{
  [key: string]: boolean;
}

/**
 * Custom password validator
 */
export class PasswordValidator {

  /**
   * Checks if the password is strong
   * @param control form controls
   * @returns form validation field for strong password
   */
  public static strong(control: FormControl): Promise<ValidationErrors | null> {
    return new Promise(resolve => {
      let hasNumber = /\d/.test(control.value);
      let hasUpper = /[A-Z]/.test(control.value);
      let hasOneSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(control.value);
      let hasLower = /[a-z]/.test(control.value);
      let length = control.value.length >= 8;
      const valid = hasNumber && hasUpper && hasLower && length && hasOneSpecial;

      setTimeout(() => {
        if (!valid) {
          resolve({ strong: true });
        } else {
          resolve(null);
        }
      }, 1000);
    });
  }

  /**
   * Checks if the password and confirm password fields match
   * @param group form group
   * @returns form validation field for matching password and confirm password
   */
  public static matchPassword(group: FormGroup): ValidationErrors | null {
    if(!group){
      return null
    }

    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    // Return null if passwords match or if the confirmPassword field is empty
    // Otherwise, return the validation error
    if (password === confirmPassword || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { matchPassword: true };
  }
}
/**
 * Custom email validator interface
 */
export interface emailValidator {
  [key: string]: boolean;
}

/**
 * Custom email validator
 */
export class EmailValidator {
  /**
   * Validates an email address (checks for @ and .)
   * @param control form controls
   * @returns form validation field for valid email
   */
  public static valid(control: FormControl): Promise<ValidationErrors | null> {
    return new Promise(resolve => {
      let hasAt = /@/.test(control.value);
      let hasDot = /\./.test(control.value);
      const valid = hasAt && hasDot;

      setTimeout(() => {
        if (!valid) {
          resolve({ valid: true });
        } else {
          resolve(null);
        }
      }, 1000);
    });
  }
}