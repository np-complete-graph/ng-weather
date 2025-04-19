import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  output,
  signal,
} from "@angular/core";
import { TabComponent } from "../tab/tab.component";

const KEY_TAB_INDEX = "tab.index";

@Component({
  selector: "app-tab-container",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./tab-container.component.html",
  styleUrl: "./tab-container.component.css",
  imports: [CommonModule],
})
export class TabContainerComponent {
  /** flag to continue where the user left off */
  public keepPosition = signal(true);
  public selectedIndex = signal(0);

  tabs = contentChildren(TabComponent);
  selectedTabTemplate = computed(() =>
    this.tabs()?.[this.selectedIndex()]?.contentTemplate()
  );

  close = output<string>();

  constructor() {
    if (this.keepPosition()) {
      // continue on tab, where user left the page
      const storedTabIndex = localStorage.getItem(KEY_TAB_INDEX);
      if (storedTabIndex) {
        this.selectedIndex.set(+storedTabIndex);
      }

      effect(() =>
        localStorage.setItem(KEY_TAB_INDEX, this.selectedIndex().toString())
      );
    }
  }

  closeTab(event: Event, tabId: string) {
    event.stopPropagation();

    // when removing a tab, we might need to correct the selectedIndex
    // to make sure that the same tab remaind selected
    const currentIndex = this.selectedIndex();
    const removingIndex = this.tabs().findIndex((t) => t.id() === tabId);
    if (removingIndex <= currentIndex) {
      this.selectedIndex.update((index) => Math.max(0, index - 1));
    }

    this.close.emit(tabId);
  }
}
