import { Country } from "./country.interface"
import { Region } from "./region.type"

export interface CacheStore{
    byCapital: TerContries,
    byCountries: TerContries,
    byRegion: RegionCountries
}


export interface TerContries {
    term: string,
    countries: Country[]
}

export interface RegionCountries {
    region: Region,
    countries: Country[]
}