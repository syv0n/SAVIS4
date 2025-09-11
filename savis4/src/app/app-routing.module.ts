import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { OneProportionComponent } from './features/one-proportion/one-proportion.component';
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
import { CsvFileUploadComponent } from './components/csv-file-upload/csv-file-upload.component';
import { AboutComponent } from './components/about/about.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { BarChartComponent } from './features/bar-chart/bar-chart.component';
import { DotChartComponent } from './features/dot-chart/dot-chart.component';
import { UserManualComponent } from './user-manual/user-manual.component';
import { DownloadPageComponent } from './download-page/download-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'oneproportion', component: OneProportionComponent },
  { path: 'twoproportions', component: TwoProportionsComponent },
  { path: 'onemean', component: OneMeanComponent },
  { path: 'twomeans', component: TwoMeansComponent },
  { path: 'onemeanCI', component: OneMeanCIComponent },
  { path: 'twomeansCI', component: TwoMeansCIComponent },
  { path: 'twoproportionsCI', component: TwoProportionsCIComponent },
  { path: 'oneproportionCI', component: OneProportionCIComponent },
  { path: 'LR', component: LinearRegressionComponent },
  { path: 'correlation', component: CorrelationComponent },
  { path: 'homepage', component: HomepageComponent },
  { path: 'csv', component: CsvFileUploadComponent },
  { path: 'about', component: AboutComponent },
  { path: 'forgotpassword', component: ForgotpasswordComponent },
  { path: 'barchart', component: BarChartComponent },
  { path: 'dotplot', component: DotChartComponent },
  { path: 'user-manual', component: UserManualComponent },
  { path: 'download-page', component: DownloadPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouterModule { }
