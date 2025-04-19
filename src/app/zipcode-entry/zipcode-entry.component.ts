import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LocationService } from "../location.service";

@Component({
  selector: "app-zipcode-entry",
  templateUrl: "./zipcode-entry.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class ZipcodeEntryComponent {
  private service = inject(LocationService);

  public zipcodeInput = new FormControl<string>("");

  addLocation(zipcode: string) {
    this.service.addLocation(zipcode);
    this.zipcodeInput.patchValue("");
  }
}
