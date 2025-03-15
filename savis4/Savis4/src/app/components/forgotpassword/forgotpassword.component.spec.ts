import { ComponentFixture, TestBed } from "@angular/core/testing"
import { ForgotpasswordComponent } from "./forgotpassword.component"
import { APP_BASE_HREF } from "@angular/common"
import { AngularFireAuth } from "@angular/fire/auth"
import { RouterTestingModule } from '@angular/router/testing'
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms"
import { LanguageSwitcherComponent } from "../language-switcher/language-switcher.component"
import { TranslateModule } from "@ngx-translate/core"

const mockAngularFireAuth: Partial<AngularFireAuth> = {
    sendPasswordResetEmail: jest.fn().mockReturnValue(Promise.resolve())
}

describe('ForgotpasswordComponent', () => {
    let component: ForgotpasswordComponent
    let fixture: ComponentFixture<ForgotpasswordComponent>
    
    beforeEach(async() => {

        await TestBed.configureTestingModule({
            declarations: [ ForgotpasswordComponent, LanguageSwitcherComponent ],
            imports: [ 
                RouterTestingModule,
                ReactiveFormsModule,
                TranslateModule.forRoot()
            ],
            providers:[ 
                { provide: APP_BASE_HREF, useValue: '/' },
                { provide: AngularFireAuth, useValue: mockAngularFireAuth }
            ]
        })
        .compileComponents()
    })
    
    beforeEach(() => {
        fixture = TestBed.createComponent(ForgotpasswordComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
    
    it('should send email to user when they submit form with valid email', async () => {
        const email = 'jasonyu23456789@gmail.com';
        component.forgotPasswordForm.controls['email'].setValue(email)

        jest.spyOn(component.forgotPasswordForm, 'valid', 'get').mockReturnValue(true)

        await component.onSubmit()

        expect(mockAngularFireAuth.sendPasswordResetEmail).toHaveBeenCalledWith(email)

        expect(component.successMessage).toEqual('Password reset email sent, please check your email. You will be redirected to the login page in 5 seconds.')
    })

    it('should handle error when sendPasswordResetEmail fails', async () => {
        const email = 'temp'
        component.forgotPasswordForm.controls['email'].setValue(email)

        jest.spyOn(component.forgotPasswordForm, 'valid', 'get').mockReturnValue(true)
    
        const error = { message: 'Error message' }
        jest.spyOn(mockAngularFireAuth, 'sendPasswordResetEmail').mockImplementation(() => Promise.reject(error))
    
        await component.onSubmit()

        expect(mockAngularFireAuth.sendPasswordResetEmail).toHaveBeenCalledWith(email)
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

})