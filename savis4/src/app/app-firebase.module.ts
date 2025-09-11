import { NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire";
import { environment } from "../environments/environment";

@NgModule({
    imports: [AngularFireModule.initializeApp(environment.firebaseConfig)],
    exports: [AngularFireModule]
})
export class AppFirebaseModule {}