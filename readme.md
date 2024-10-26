# Sofar Power Flow Card

A custom card for Home Assistant that displays real-time power flow data from Sofar/ZCS inverters.

## Installation

### HACS
1. Add this repository to HACS
2. Search for "Sofar Power Flow Card"
3. Install the card
4. Add to your dashboard

### Manual
1. Download `sofar-power-flow-card.js`
2. Copy to `www/` folder
3. Add to your dashboard resources:
```yaml
resources:
  - url: /local/sofar-power-flow-card.js
    type: module
```

## Usage
```yaml
type: custom:sofar-power-flow-card
title: Solar Production
entities:
  solar_production: sensor.solar_power
  battery_level: sensor.battery_level
  battery_power: sensor.battery_power
  grid_power: sensor.grid_power
  consumption: sensor.home_consumption
```
