import { computed, inject, Injectable } from "@angular/core";
import { EMPTY, forkJoin, Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { HttpClient } from "@angular/common/http";
import { rxResource } from "@angular/core/rxjs-interop";
import { ConditionsAndZip } from "./conditions-and-zip.type";
import { CurrentConditions } from "./current-conditions/current-conditions.type";
import { Forecast } from "./forecasts-list/forecast.type";
import { LocationService } from "./location.service";
import { CachingService } from "./shared/services/caching.service";

@Injectable()
export class WeatherService {
  static URL = "https://api.openweathermap.org/data/2.5";
  static APPID = "5a4b2d457ecbef9eb2a71e480b947604";
  static ICON_URL =
    "https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/";

  private http = inject(HttpClient);
  private locationService = inject(LocationService);
  private cachingService = inject(CachingService);

  public currentConditionsByZip = computed(() => {
    const conditionsResource = this.currentConditionsResource;
    if (conditionsResource.isLoading()) return [];
    return conditionsResource.value();
  });

  private currentConditionsResource = rxResource({
    request: () => this.locationService.locations(),
    loader: ({ request }) => {
      // load conditions for all locations in parallel
      if (request.length === 0) return of([]);
      return forkJoin(
        request.map((zipcode) =>
          this.getFromCacheOrFetch(`conditions/${zipcode}`, () =>
            this.fetchConditions(zipcode)
          )
        )
      );
    },
  });

  getForecast(zipcode: string): Observable<Forecast> {
    return this.getFromCacheOrFetch(`forecast/${zipcode}`, () =>
      this.http
        .get<Forecast>(
          `${WeatherService.URL}/forecast/daily?zip=${zipcode},US&units=imperial&cnt=5&APPID=${WeatherService.APPID}`
        )
        .pipe(
          tap((data) =>
            this.cachingService.saveItem(`forecast/${zipcode}`, data)
          ),
          catchError(() => EMPTY)
        )
    );
  }

  getWeatherIcon(id): string {
    if (!id) return "";
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else return WeatherService.ICON_URL + "art_clear.png";
  }

  private fetchConditions(zipcode: string): Observable<ConditionsAndZip> {
    return this.http
      .get<CurrentConditions>(
        `${WeatherService.URL}/weather?zip=${zipcode},US&units=imperial&APPID=${WeatherService.APPID}`
      )
      .pipe(
        map((condition) => ({ data: condition, zip: zipcode })),
        tap((data) =>
          this.cachingService.saveItem(`conditions/${zipcode}`, data)
        ),
        catchError(() => {
          // in the future maybe show an error on the card to allow realding it
          console.warn("Failed loading conditions for ", zipcode);
          return of({ zip: zipcode, data: undefined });
        })
      );
  }

  private getFromCacheOrFetch<T>(
    key: string,
    fetchHandler: () => Observable<T>
  ): Observable<T> {
    const cachedItem = this.cachingService.getItem<T>(key);
    if (cachedItem) return of(cachedItem.data);

    return fetchHandler();
  }
}
