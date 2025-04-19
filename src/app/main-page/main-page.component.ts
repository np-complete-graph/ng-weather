import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CurrentConditionsComponent } from "app/current-conditions/current-conditions.component";
import { ZipcodeEntryComponent } from "app/zipcode-entry/zipcode-entry.component";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZipcodeEntryComponent, CurrentConditionsComponent],
})
export class MainPageComponent {}
