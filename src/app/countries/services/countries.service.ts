import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, Observable, of, tap } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({providedIn: 'root'})
export class CountriesService {
    constructor(private http: HttpClient) {
        this.loadFromLocalStorage()
     }
    

    private apiUrl = 'https://restcountries.com/v3.1'
    public cacheStore: CacheStore = {
        byCapital: { term: '', countries: []},
        byCountries: { term: '', countries: []},
        byRegion: { region: '', countries: []},
     }

    private geCountriesRequest( url: string) : Observable<Country[]> {
        return this.http.get<Country[]>(url)
        .pipe(
            catchError( () => of([])),
            // delay(2000)
        )
    }


    private saveToLocalStorage( ): void {
        localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore))
    }

    private loadFromLocalStorage(): void {
        if ( !localStorage.getItem('cacheStore') ) return;
        this.cacheStore = JSON.parse(localStorage.getItem('cacheStore')!)

    }


    searchCountryByAlphaCode( code : string) : Observable<Country | null> {
        return this.http.get<Country[]>(`${this.apiUrl}/alpha/${code}`)
        .pipe(
            map( countries => countries.length > 0 ? countries[0] : null),
            catchError( () => of(null))
        )
    }

    searchCapital( term : string) : Observable<Country[]> {
        const url = `${this.apiUrl}/capital/${term}`
        return this.geCountriesRequest(url)
        .pipe(
            tap( countries => this.cacheStore.byCapital = { term, countries } ),
            tap( () => this.saveToLocalStorage() )
        )
        
    }

    searchCountry( term : string) : Observable<Country[]> {
        const url = `${this.apiUrl}/name/${term}`
        return this.geCountriesRequest(url)
        .pipe(
            tap( countries => this.cacheStore.byCountries = { term, countries } ),
            tap( () => this.saveToLocalStorage() )
        )
    }

    searchRegion( region : Region) : Observable<Country[]> {
        const url = `${this.apiUrl}/region/${region}`
        return this.geCountriesRequest(url)
        .pipe(
            tap( countries => this.cacheStore.byRegion = { region, countries } ),
            tap( () => this.saveToLocalStorage() )
        )
    }
    
}