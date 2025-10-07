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
import { ProblemsComponent } from './problems/problems.component';
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
  { path: 'download-page', component: DownloadPageComponent },
  { path: 'opht', component: OPHTManualComponent },
  { path: 'opci', component: OPCIManualComponent },
  { path: 'omht', component: OMHTManualComponent },
  { path: 'omci', component: OMCIManualComponent },
  { path: 'dot-plot', component: DotPlotManualComponent },
  { path: 'correlation-manual', component: CorrelationUMManualComponent },
  { path: 'bar-chart', component: BarChartManualComponent },
  { path: 'regression', component: RegressionManualComponent },
  { path: 'tmci', component: TMCIManualComponent },
  { path: 'tmht', component: TMHTManualComponent },
  { path: 'tpci', component: TPCIManualComponent },
  { path: 'tpht', component: TPHTManualComponent },
  { path: 'problems', component: ProblemsComponent },
  { path: 'problems-bar-chart', component: BarChartProblemsComponent },
  { path: 'problems-correlation', component: CorrelationProblemsComponent },
  { path: 'problems-dot-plot', component: DotPlotProblemsComponent },
  { path: 'problems-omci', component: OMCIProblemsComponent },
  { path: 'problems-omht', component: OMHTProblemsComponent },
  { path: 'problems-opci', component: OPCIProblemsComponent },
  { path: 'problems-opht', component: OPHTProblemsComponent },
  { path: 'problems-regression', component: RegressionProblemsComponent },
  { path: 'problems-tmci', component: TMCIProblemsComponent },
  { path: 'problems-tmht', component: TMHTProblemsComponent },
  { path: 'problems-tpci', component: TPCIProblemsComponent },
  { path: 'problems-tpht', component: TPHTProblemsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouterModule { }
