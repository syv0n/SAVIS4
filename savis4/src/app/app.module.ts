import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRouterModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OneProportionComponent } from './features/one-proportion/one-proportion.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TwoProportionsComponent } from './features/two-proportions/two-proportions.component';
import { OneMeanComponent } from './features/one-mean/one-mean.component';
import { TwoMeansComponent } from './features/two-means/two-means.component';
import { OneMeanCIComponent } from './features/one-mean-ci/one-mean-ci.component';
import { TwoMeansCIComponent } from './features/two-means-ci/two-means-ci.component';
import { TwoProportionsCIComponent } from './features/two-proportions-ci/two-proportions-ci.component';
import { OneProportionCIComponent } from './features/one-proportion-ci/one-proportion-ci.component';
import { LinearRegressionComponent } from './features/linear-regression/linear-regression.component';
import { CorrelationComponent } from './features/correlation/correlation.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ScatterPlotComponent } from './features/linear-regression/scatter-plot/scatter-plot.component';
import { ChartsModule } from 'ng2-charts';
import { CsvFileUploadComponent } from './components/csv-file-upload/csv-file-upload.component';
import { AboutComponent } from './components/about/about.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { InputComponent } from './features/correlation/input/input.component';
import { AppFirebaseModule } from './app-firebase.module';
import { MathService } from './Utils/math.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SaveLoadButtonsComponent } from './components/save-load-buttons/save-load-buttons.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'
import { SaveDialogComponent } from './components/save-load-buttons/save-dialog/save-dialog.component';
import { LoadDialogComponent } from './components/save-load-buttons/load-dialog/load-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmationDialogComponent } from './components/save-load-buttons/confirmation-dialog/confirmation-dialog.component';
import { BarChartComponent } from './features/bar-chart/bar-chart.component';
import { DotChartComponent } from './features/dot-chart/dot-chart.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { UserManualComponent } from './user-manual/user-manual.component';
import { DownloadPageComponent } from './download-page/download-page.component';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { OPHTManualComponent } from './user-manual/user-manual-components/opht/opht.component';
import { OPCIManualComponent } from './user-manual/user-manual-components/opci/opci.component';
import { OMHTManualComponent } from './user-manual/user-manual-components/omht/omht.component';
import { OMCIManualComponent } from './user-manual/user-manual-components/omci/omci.component';
import { DotPlotManualComponent } from './user-manual/user-manual-components/dot-plot/dot-plot.component';
import { CorrelationUMManualComponent } from './user-manual/user-manual-components/correlation/correlation_um.component';
import { BarChartManualComponent } from './user-manual/user-manual-components/bar-chart/bar-chart.component';
import { RegressionManualComponent } from './user-manual/user-manual-components/regression/regression.component';
import { TMCIManualComponent } from './user-manual/user-manual-components/tmci/tmci.component';
import { TMHTManualComponent } from './user-manual/user-manual-components/tmht/tmht.component';
import { TPCIManualComponent } from './user-manual/user-manual-components/tpci/tpci.component';
import { TPHTManualComponent } from './user-manual/user-manual-components/tpht/tpht.component';
import { ProblemsComponent } from './problems/problems.component';``
import { BarChartProblemsComponent } from './problems/problems-components/bar-chart/bar-chart.component';
import { CorrelationProblemsComponent } from './problems/problems-components/correlation/correlation_problems.component';
import { DotPlotProblemsComponent } from './problems/problems-components/dot-plot/dot-plot.component';
import { OMCIProblemsComponent } from './problems/problems-components/omci/omci.component';
import { OMHTProblemsComponent } from './problems/problems-components/omht/omht.component';
import { OPCIProblemsComponent } from './problems/problems-components/opci/opci.component';
import { OPHTProblemsComponent } from './problems/problems-components/opht/opht.component';
import { RegressionProblemsComponent } from './problems/problems-components/regression/regression.component';
import { TMCIProblemsComponent } from './problems/problems-components/tmci/tmci.component';
import { TMHTProblemsComponent } from './problems/problems-components/tmht/tmht.component';
import { TPCIProblemsComponent } from './problems/problems-components/tpci/tpci.component';
import { TPHTProblemsComponent } from './problems/problems-components/tpht/tpht.component';

export function HttpLoaderFactory(http: HttpClient){
  return new TranslateHttpLoader(http)
}

export function setupTranslateFactory(service : TranslateService): Function {
  return () => new Promise((resolve, reject) => {
    const savedLang = localStorage.getItem('lang');
    const initialLang = savedLang ? savedLang : 'en';
    service.use(initialLang).subscribe(
      () => resolve(null),
      error => reject(error)
    );
  });
}

@NgModule({
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
    SaveDialogComponent,
    LoadDialogComponent,
    ConfirmationDialogComponent,
    BarChartComponent,
    DotChartComponent,
    UserManualComponent,
    DownloadPageComponent,
    CalculatorComponent,
    OPHTManualComponent,
    OPCIManualComponent,
    OMHTManualComponent,
    OMCIManualComponent,
    DotPlotManualComponent,
    CorrelationUMManualComponent,
    BarChartManualComponent,
    RegressionManualComponent,
    TMCIManualComponent,
    TMHTManualComponent,
    TPCIManualComponent,
    TPHTManualComponent,
    ProblemsComponent,
    BarChartProblemsComponent,
    CorrelationProblemsComponent,
    DotPlotProblemsComponent,
    OMCIProblemsComponent,
    OMHTProblemsComponent,
    OPCIProblemsComponent,
    OPHTProblemsComponent,
    RegressionProblemsComponent,
    TMCIProblemsComponent,
    TMHTProblemsComponent,
    TPCIProblemsComponent,
    TPHTProblemsComponent

  ],
  imports: [
    BrowserModule,
    AppRouterModule,
    FormsModule,
    ReactiveFormsModule,
    AppFirebaseModule,
    ChartsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
    ],
  providers: [
    MathService,
    TranslateService,
    {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateFactory,
      deps: [TranslateService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
