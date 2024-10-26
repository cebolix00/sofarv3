import { LovelaceCardConfig } from 'custom-card-helpers';

export interface SofarPowerFlowCardConfig extends LovelaceCardConfig {
  type: string;
  title?: string;
  theme?: 'dark' | 'light';
  show_forecast?: boolean;
  update_interval?: number;
  entities: {
    solar_production: string;
    battery_level: string;
    battery_power: string;
    grid_power: string;
    consumption: string;
  };
}

export interface SolarSystemData {
  solar: {
    current: number;
    daily: number;
    predicted: number;
    lastHour: number;
    unit: string;
  };
  battery: {
    level: number;
    power: number;
    charging: boolean;
    lastHour: number;
    unit: string;
  };
  grid: {
    power: number;
    daily: {
      imported: number;
      exported: number;
    };
    lastHour: number;
    unit: string;
  };
  consumption: {
    current: number;
    daily: number;
    lastHour: number;
    unit: string;
  };
}

export interface ForecastData {
  time: string;
  predicted: number;
  actual: number | null;
  cloudCover: number;
}
