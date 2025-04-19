import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { ConditionsAndZip } from "app/conditions-and-zip.type";
import { WeatherService } from "app/weather.service";

@Component({
  selector: "app-condition-card",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./condition-card.component.html",
  styleUrl: "./condition-card.component.css",
  imports: [CommonModule, RouterLink],
})
export class ConditionCardComponent {
  public location = input.required<ConditionsAndZip>();

  public weatherService = inject(WeatherService);
}
