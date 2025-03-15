import { TestBed } from "@angular/core/testing"
import { AppComponent } from "./app.component"
import { AppRouterModule } from "./app-routing.module"
import { MathService } from "./Utils/math.service"
import { LoginComponent } from "./components/login/login.component"
import { SignupComponent } from "./components/signup/signup.component"
import { AboutComponent } from "./components/about/about.component"
import { CsvFileUploadComponent } from "./components/csv-file-upload/csv-file-upload.component"
import { ForgotpasswordComponent } from "./components/forgotpassword/forgotpassword.component"
import { HomepageComponent } from "./components/homepage/homepage.component"
import { CorrelationComponent } from "./features/correlation/correlation.component"
import { InputComponent } from "./features/correlation/input/input.component"
import { LinearRegressionComponent } from "./features/linear-regression/linear-regression.component"
import { ScatterPlotComponent } from "./features/linear-regression/scatter-plot/scatter-plot.component"
import { OneMeanCIComponent } from "./features/one-mean-ci/one-mean-ci.component"
import { OneMeanComponent } from "./features/one-mean/one-mean.component"
import { OneProportionCIComponent } from "./features/one-proportion-ci/one-proportion-ci.component"
import { OneProportionComponent } from "./features/one-proportion/one-proportion.component"
import { TwoMeansCIComponent } from "./features/two-means-ci/two-means-ci.component"
import { TwoMeansComponent } from "./features/two-means/two-means.component"
import { TwoProportionsCIComponent } from "./features/two-proportions-ci/two-proportions-ci.component"
import { TwoProportionsComponent } from "./features/two-proportions/two-proportions.component"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { ChartsModule } from "ng2-charts"
import { BrowserModule } from "@angular/platform-browser"
import { AppFirebaseModule } from "./app-firebase.module"
import { APP_BASE_HREF } from "@angular/common"
import { NavbarComponent } from "./components/navbar/navbar.component"
import { FooterComponent } from "./components/footer/footer.component"
import { HttpClient } from "@angular/common/http"
import { TranslateModule, TranslateLoader } from "@ngx-translate/core"
import { HttpLoaderFactory } from "./app.module"
import { LanguageSwitcherComponent } from "./components/language-switcher/language-switcher.component"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { BarChartComponent } from "./features/bar-chart/bar-chart.component"
import { DotChartComponent } from "./features/dot-chart/dot-chart.component"
import { SharedService } from "./services/shared.service"
import { SaveLoadButtonsComponent } from "./components/save-load-buttons/save-load-buttons.component"

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        OneProportionComponent,
        LoginComponent,
        SignupComponent,
        TwoProportionsComponent,
        OneMeanComponent,
        TwoMeansComponent,
        OneMeanCIComponent,
        TwoMeansCIComponent,
        TwoProportionsCIComponent,
        OneProportionCIComponent,
        LinearRegressionComponent,
        CorrelationComponent,
        HomepageComponent,
        ScatterPlotComponent,
        CsvFileUploadComponent,
        AboutComponent,
        ForgotpasswordComponent,
        InputComponent,
        NavbarComponent,
        FooterComponent,
        LanguageSwitcherComponent,
        SaveLoadButtonsComponent,
        BarChartComponent,
        DotChartComponent
      ],
      imports: [
        BrowserModule,
        AppRouterModule,
        FormsModule,
        ReactiveFormsModule,
        AppFirebaseModule,
        ChartsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        BrowserAnimationsModule
      ],
      providers:[
        MathService,
        { provide: APP_BASE_HREF, useValue: '/' },
        SharedService
      ]
    }).compileComponents()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
    expect(app.title).toEqual('Savis3')
  })

})