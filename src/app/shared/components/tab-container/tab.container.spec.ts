import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TabContainerComponent } from "./tab-container.component";

describe("TabContainer", () => {
  let fixture: ComponentFixture<TabContainerComponent>;
  let component: TabContainerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TabContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabContainerComponent);
    component = fixture.componentInstance;
  });

  const testCases: { selected: number; removing: number; expected: number }[] =
    [
      { selected: 0, removing: 1, expected: 0 },
      { selected: 3, removing: 1, expected: 2 },
    ];
  testCases.forEach(({ selected, removing, expected }) => {
    it(`should correct selected index on remove: at ${selected} removing ${removing} should yield ${expected}`, () => {
      component.selectedIndex.set(selected);

      component.closeTab(new Event("click"), "someId");

      fixture.detectChanges();

      expect(component.selectedIndex()).toBe(expected);
    });
  });
});
