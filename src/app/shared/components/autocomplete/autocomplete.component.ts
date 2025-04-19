import { CommonModule } from "@angular/common";
import { Component, effect, input, model, output, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { debounceTime, filter } from "rxjs/operators";

export interface AutocompleteOption {
  id: string;
  description: string;
}
@Component({
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class AutocompleteComponent<T extends AutocompleteOption> {
  showDropdown = signal(false);

  placeholder = input("");
  filteredOptions = input.required<T[]>();

  query = model<string>();
  selected = output<T | string>();

  queryInput = new FormControl<string>("", { updateOn: "change" });
  private queryChanges = toSignal(
    this.queryInput.valueChanges.pipe(
      filter((v) => v?.length >= 3),
      debounceTime(300)
    ),
    { initialValue: "" }
  );

  constructor() {
    effect(() => {
      const query = this.queryChanges();
      this.query.set(query);

      if (query.length < 3) return;
      this.showDropdown.set(true);
    });
  }

  onSelect(option: T) {
    this.showDropdown.set(false);
    this.selected.emit(option);
    this.queryInput.patchValue("");
  }
}
