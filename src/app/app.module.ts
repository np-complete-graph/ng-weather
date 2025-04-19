import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { routing } from "./app.routing";
import { LocationService } from "./location.service";
import { WeatherService } from "./weather.service";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    routing,
    ServiceWorkerModule.register("/ngsw-worker.js", {
      enabled: environment.production,
    }),
  ],
  providers: [
    LocationService,
    WeatherService,
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
