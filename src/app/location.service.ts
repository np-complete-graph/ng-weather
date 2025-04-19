import { effect, Injectable, signal } from "@angular/core";

export const LOCATIONS: string = "locations";

@Injectable()
export class LocationService {
  private _locations = signal<string[]>([]);
  public locations = this._locations.asReadonly();

  constructor() {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      try {
        this._locations.set(JSON.parse(locString));
      } catch (err: unknown) {
        console.error("Error parsing locations from localStorage:" + err);
      }
    }

    // keep localStorage synced with signal
    effect(() => {
      localStorage.setItem(LOCATIONS, JSON.stringify(this._locations()));
    });
  }

  addLocation(zipcode: string) {
    if (zipcode.length <= 0) {
      console.info("Not adding empty location");
      return;
    }

    if (this._locations().find((location) => location === zipcode)) {
      console.info("Not adding location, as it already exists");
      return;
    }

    this._locations.update((locations) => [...locations, zipcode]);
  }

  removeLocation(zipcode: string) {
    this._locations.update((locations) =>
      locations.filter((l) => l !== zipcode)
    );
  }
}
