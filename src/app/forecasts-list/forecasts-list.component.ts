import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { tap } from "rxjs/operators";
import { WeatherService } from "../weather.service";
import { Forecast } from "./forecast.type";

@Component({
  selector: "app-forecasts-list",
  templateUrl: "./forecasts-list.component.html",
  styleUrls: ["./forecasts-list.component.css"],
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForecastsListComponent {
  private weatherService = inject(WeatherService);
  private route = inject(ActivatedRoute);

  private routeParams = toSignal(this.route.params);
  private zipcode = computed(() => this.routeParams()?.["zipcode"]);

  forecast = signal<Forecast | undefined>(undefined);

  private _fetchForecast = effect(() => {
    this.weatherService
      .getForecast(this.zipcode())
      .pipe(tap((forecast) => this.forecast.set(forecast)))
      .subscribe();
  });
}
