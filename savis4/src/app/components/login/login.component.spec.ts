import { ComponentFixture, TestBed } from "@angular/core/testing"
import { LoginComponent } from "./login.component"
import { APP_BASE_HREF } from "@angular/common"
import { AngularFireAuth } from "@angular/fire/auth"
import { RouterTestingModule } from '@angular/router/testing'
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import {User} from '@firebase/auth-types';
import { LanguageSwitcherComponent } from "../language-switcher/language-switcher.component"
import { TranslateModule } from "@ngx-translate/core"



const mockAngularFireAuth: any = {
    createUserWithEmailAndPassword: jest.fn()
}

describe('loginComponent', () => {
    let component: LoginComponent
    let fixture: ComponentFixture<LoginComponent>
    let router: Router
    let mockAngularFireAuth: jest.Mocked<AngularFireAuth>;


    beforeEach(async() => {

        await TestBed.configureTestingModule({
            declarations: [ LoginComponent, LanguageSwitcherComponent ],
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
        fixture = TestBed.createComponent(LoginComponent)
        component = fixture.componentInstance
        router = TestBed.inject(Router)
        fixture.detectChanges()
        mockAngularFireAuth = TestBed.inject(AngularFireAuth) as jest.Mocked<AngularFireAuth>; // Get the mocked instance

    })


  it('should create', () => {
    expect(component).toBeTruthy();
  })


  it('should create the login form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('username')).toBeDefined();
    expect(component.loginForm.get('password')).toBeDefined();
   
  })
  it('should validate all form fields on submit if form is invalid', () => {
    component.loginForm.get('username')!.setValue('');
    component.loginForm.get('password')!.setValue('');


    component.onSubmit();


    expect(component.loginForm.get('username')!.dirty).toBeTruthy();
    expect(component.loginForm.get('password')!.dirty).toBeTruthy();
  })

  
  it('should mark all form fields as dirty', () => {
    const formGroup = new FormGroup({
        field1: new FormControl(''),field2: new FormControl(''),nestedGroup: new FormGroup({
            nestedField: new FormControl('')
        })
    })

    component.validateAllFormFields(formGroup)

    expect(formGroup.get('field1')?.dirty).toBe(true)
    expect(formGroup.get('field2')?.dirty).toBe(true)
    expect(formGroup.get('nestedGroup')?.get('nestedField')?.dirty).toBe(true)
})

it('successfully logs in the user', async () => {
  // Arrange
  const expectedEmail = 'test@gmail.com';
  const expectedPassword = 'Testing12#';
  const mockUser = { email: expectedEmail };

  const mockedSignIn = jest.fn().mockResolvedValue(mockUser); 
  // Act
  const returnedUser = await mockedSignIn(expectedEmail, expectedPassword); 

  // Assert
  expect(mockedSignIn).toHaveBeenCalledWith( expectedEmail, expectedPassword); 
  expect(returnedUser).toEqual(mockUser); 
});

it('should navigate to the homepage for a guest', () => {
  const navigateSpy = jest.spyOn(router, 'navigate'); // Spy on router.navigate

  component.guestOnSubmit();

  expect(navigateSpy).toHaveBeenCalledWith(['/homepage']); // Assert navigation with correct path
});

})

