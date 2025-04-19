import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { rxResource, toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { WeatherService } from "../weather.service";

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

  forecast = rxResource({
    request: () => this.zipcode(),
    loader: ({ request }) => this.weatherService.getForecast(request),
  });
}
