import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainPageComponent } from "./main-page/main-page.component";

const appRoutes: Routes = [
  {
    path: "",
    component: MainPageComponent,
  },
  {
    // lazy load js content
    path: "forecast/:zipcode",
    loadComponent: () =>
      import("./forecasts-list/forecasts-list.component").then(
        (m) => m.ForecastsListComponent
      ),
  },
];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(
  appRoutes,
  {}
);
