import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AutocompleteComponent } from "app/shared/components/autocomplete/autocomplete.component";
import { map } from "rxjs/operators";
import { LocationService } from "../location.service";

@Component({
  selector: "app-zipcode-entry",
  templateUrl: "./zipcode-entry.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteComponent,
  ],
})
export class ZipcodeEntryComponent {
  private locationService = inject(LocationService);

  public queryOrZipcode = signal<string>("");

  public foundZipcodes = rxResource({
    request: () => this.queryOrZipcode(),
    loader: ({ request }) =>
      this.locationService
        .getZipcodesByName(request)
        .pipe(
          map((codes) => codes.map((code) => ({ id: code, description: code })))
        ),
  });

  addLocation(zipcode: string) {
    this.locationService.addLocation(zipcode);
  }
}
