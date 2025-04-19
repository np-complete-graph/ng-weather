import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { AutocompleteComponent } from "app/shared/components/autocomplete/autocomplete.component";
import { map } from "rxjs/operators";
import { LocationService } from "../location.service";

@Component({
  selector: "app-zipcode-entry",
  templateUrl: "./zipcode-entry.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AutocompleteComponent],
})
export class ZipcodeEntryComponent {
  private locationService = inject(LocationService);

  public queryOrZipcode = signal<string>("");

  // whenever query changes, fetch zipcodes from API and map to autocomplete options
  public foundZipcodes = rxResource({
    request: () => this.queryOrZipcode(),
    loader: ({ request }) =>
      this.locationService
        .queryZipcodesByCityName(request)
        .pipe(
          map((codes) => codes.map((code) => ({ id: code, description: code })))
        ),
  });

  addLocation(zipcode: string) {
    this.locationService.addLocation(zipcode);
  }
}
