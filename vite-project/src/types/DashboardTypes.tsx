
export interface Hourly {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  wind_speed_10m: number[];
}

export interface Hourlyunits {
  time: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  wind_speed_10m: string;
}

export interface Current {
  time: string;
  interval: number;
  relative_humidity_2m: number;
  precipitation: number;
  apparent_temperature: number;
  wind_speed_10m: number;
  temperature_2m: number;
}

export interface Currentunits {
  time: string;
  interval: string;
  relative_humidity_2m: string;
  precipitation: string;
  apparent_temperature: string;
  wind_speed_10m: string;
  temperature_2m: string;
}

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: Currentunits;
  current: Current;
  hourly_units: Hourlyunits;
  hourly: Hourly;
}

export interface Hourly {
  time: string[];
  temperature_2m: number[];
  wind_speed_10m: number[];
}

export interface Hourlyunits {
  time: string;
  temperature_2m: string;
  wind_speed_10m: string;
}

export interface Current {
  time: string;
  interval: number;
  temperature_2m: number;
  wind_speed_10m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
}

export interface Currentunits {
  time: string;
  interval: string;
  temperature_2m: string;
  wind_speed_10m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
}