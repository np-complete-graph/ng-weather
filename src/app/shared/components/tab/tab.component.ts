import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  viewChild,
} from "@angular/core";

@Component({
  selector: "app-tab",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `<ng-template #contentTemplate (click)="click.emit()">
    <div style="padding: 16px; border: 1px solid black">
      <ng-content></ng-content>
    </div>
  </ng-template>`,
})
export class TabComponent {
  public id = input.required<string>();
  public title = input.required<string>();
  public contentTemplate = viewChild("contentTemplate");
}
