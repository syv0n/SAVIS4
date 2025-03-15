import { ComponentFixture, TestBed } from "@angular/core/testing"
import { SignupComponent } from "./signup.component"
import { APP_BASE_HREF } from "@angular/common"
import { AngularFireAuth } from "@angular/fire/auth"
import { RouterTestingModule } from '@angular/router/testing'
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { LanguageSwitcherComponent } from "../language-switcher/language-switcher.component"
import { TranslateModule } from "@ngx-translate/core"


const mockAngularFireAuth: any = {
    createUserWithEmailAndPassword: jest.fn()
}

describe('SignupComponent', () => {
    let component: SignupComponent
    let fixture: ComponentFixture<SignupComponent>
    let router: Router

    beforeEach(async() => {

        await TestBed.configureTestingModule({
            declarations: [ SignupComponent, LanguageSwitcherComponent ],
            imports: [ 
                RouterTestingModule,
                ReactiveFormsModule,
                TranslateModule.forRoot(),
            ],
            providers:[ 
                { provide: APP_BASE_HREF, useValue: '/' },
                { provide: AngularFireAuth, useValue: mockAngularFireAuth }
            ]
        })
        .compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(SignupComponent)
        component = fixture.componentInstance
        router = TestBed.inject(Router)
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })

    it('should create the form', () => {
        expect(component.signUpForm).toBeTruthy()
    })

    it('should create the form with the required fields', () => {
        expect(component.signUpForm.controls.firstName).toBeTruthy()
        expect(component.signUpForm.controls.lastName).toBeTruthy()
        expect(component.signUpForm.controls.email).toBeTruthy()
        expect(component.signUpForm.controls.password).toBeTruthy()
        expect(component.signUpForm.controls.confirmPassword).toBeTruthy()
    })

    it('should send email verification to user when they submit form with valid email', async() => {
        const sendEmailVerificationMock = jest.fn().mockResolvedValue(true);
        mockAngularFireAuth.createUserWithEmailAndPassword.mockResolvedValue({
            user: { sendEmailVerification: sendEmailVerificationMock }
        })

        const email = 'email@test.com'
        const password = 'password'
        component.signUpForm.controls['email'].setValue(email)
        component.signUpForm.controls['password'].setValue(password)
        component.signUpForm.controls['confirmPassword'].setValue(password)

        jest.spyOn(component.signUpForm, 'valid', 'get').mockReturnValue(true)

        await component.onSignUp()

        expect(mockAngularFireAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(email, password)
        expect(sendEmailVerificationMock).toHaveBeenCalled()
        console.log(component.successMessage)
        expect(component.successMessage).toEqual('Please check your email for verification of account creation, you will be redirected to the login page in 5 seconds.')
    })

    it('should handle error when email verification fails', async() => {
        const sendEmailVerificationMock = jest.fn().mockRejectedValue(new Error('Error message'));
        mockAngularFireAuth.createUserWithEmailAndPassword.mockResolvedValue({
            user: { sendEmailVerification: sendEmailVerificationMock }
        })
        const email = 'email@test.com'
        const password = 'password'
        component.signUpForm.controls['email'].setValue(email)
        component.signUpForm.controls['password'].setValue(password)
        component.signUpForm.controls['confirmPassword'].setValue(password)

        jest.spyOn(component.signUpForm, 'valid', 'get').mockReturnValue(true)
        const error = { message: 'Error message' }
        
        await component.onSignUp()
        expect(mockAngularFireAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(email, password)
        expect(sendEmailVerificationMock).toHaveBeenCalled()
        expect(component.errorMessage).toEqual('Error message')
    })

    it('should handle error when creating user fails', async() => {
        mockAngularFireAuth.createUserWithEmailAndPassword.mockRejectedValue(new Error('Error message'))
        const email = 'email@test.com'
        const password = 'password'
        component.signUpForm.controls['email'].setValue(email)
        component.signUpForm.controls['password'].setValue(password)
        component.signUpForm.controls['confirmPassword'].setValue(password)

        jest.spyOn(component.signUpForm, 'valid', 'get').mockReturnValue(true)
        const error = { message: 'Error message' }

        await component.onSignUp()
        expect(mockAngularFireAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(email, password)
        expect(component.errorMessage).toEqual('Error message')
    })

    it('should mark all form fields as dirty', () => {
        const formGroup = new FormGroup({
            field1: new FormControl(''),
            field2: new FormControl(''),
            nestedGroup: new FormGroup({
                nestedField: new FormControl('')
            })
        })

        component.validateAllFormFields(formGroup)

        expect(formGroup.get('field1')?.dirty).toBe(true)
        expect(formGroup.get('field2')?.dirty).toBe(true)
        expect(formGroup.get('nestedGroup')?.get('nestedField')?.dirty).toBe(true)
    
    })

    it('should prevent spaces in the password field', () => {
        const event = {
            target: {
                id: 'password',
                value: 'password with space'
            }
        }
        component.preventSpaces(event)
        expect(component.signUpForm.get('password')?.value).toEqual('passwordwithspace')
    })

    it('should prevent spaces in the confirm password field', () => {
        const event = {
            target: {
                id: 'confirmPassword',
                value: 'password with space'
            }
        }
        component.preventSpaces(event)
        expect(component.signUpForm.get('confirmPassword')?.value).toEqual('passwordwithspace')
    })

})
