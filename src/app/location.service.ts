import { HttpClient } from "@angular/common/http";
import { effect, inject, Injectable, signal } from "@angular/core";
import { EMPTY, Observable } from "rxjs";
import { map } from "rxjs/operators";

export const LOCATIONS: string = "locations";

@Injectable()
export class LocationService {
  static ZIPCODE_URL =
    "https://app.zipcodebase.com/api/v1/code/city?apikey=a559c530-1d57-11f0-9cfd-2b842989d4f9&country=us";

  private http = inject(HttpClient);

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

  /**
   * Search zipcodes by city name.
   * @param name of city with a length of three or more characters
   * @returns a list of zipcodes with their names
   */
  getZipcodesByName(name: string): Observable<string[]> {
    if (name.length < 3) return EMPTY;

    return this.http
      .get<{ results: string[] }>(
        `${LocationService.ZIPCODE_URL}&city=${encodeURIComponent(name)}`
      )
      .pipe(map((response) => response.results));
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
