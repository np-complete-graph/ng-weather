import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { TabContainerComponent } from "app/shared/components/tab-container/tab-container.component";
import { TabComponent } from "app/shared/components/tab/tab.component";
import { ConditionCardComponent } from "../condition-card/condition-card.component";
import { ConditionsAndZip } from "../conditions-and-zip.type";
import { LocationService } from "../location.service";
import { WeatherService } from "../weather.service";

export interface TabData<T> {
  id: string;
  title: string;
  data: T;
}

@Component({
  selector: "app-current-conditions",
  templateUrl: "./current-conditions.component.html",
  styleUrls: ["./current-conditions.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TabContainerComponent,
    TabComponent,
    ConditionCardComponent,
  ],
})
export class CurrentConditionsComponent {
  private weatherService = inject(WeatherService);
  protected locationService = inject(LocationService);

  protected tabDatas = computed(() =>
    this.weatherService
      .currentConditionsByZip()
      .map<TabData<ConditionsAndZip>>((condition) => ({
        id: condition.zip,
        title: `${condition?.data?.name ?? "unknown"} (${condition.zip})`,
        data: condition,
      }))
  );

  removeLocation(zipcode: string) {
    this.locationService.removeLocation(zipcode);
  }
}
