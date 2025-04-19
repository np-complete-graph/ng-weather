import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  model,
  output,
} from "@angular/core";
import { TabComponent } from "../tab/tab.component";

@Component({
  selector: "app-tab-container",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./tab-container.component.html",
  styleUrl: "./tab-container.component.css",
  imports: [CommonModule],
})
export class TabContainerComponent {
  public selectedIndex = model(0);

  tabs = contentChildren(TabComponent);
  selectedTabTemplate = computed(() =>
    this.tabs()?.[this.selectedIndex()]?.contentTemplate()
  );

  close = output<string>();

  closeTab(event: Event, tabId: string) {
    event.stopPropagation();

    // when removing a tab, we might need to correct the selectedIndex to make
    // sure that the same tab remaind selected
    const currentIndex = this.selectedIndex();
    const removingIndex = this.tabs().findIndex((t) => t.id() === tabId);
    if (removingIndex <= currentIndex) {
      this.selectedIndex.update((index) => Math.max(0, index - 1));
    }

    this.close.emit(tabId);
  }
}
