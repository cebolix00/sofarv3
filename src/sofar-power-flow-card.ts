import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { SofarPowerFlowCardConfig } from './types/card-types';
import { styles } from './styles';

@customElement('sofar-power-flow-card')
export class SofarPowerFlowCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) private config!: SofarPowerFlowCardConfig;

  static styles = styles;

  setConfig(config: SofarPowerFlowCardConfig): void {
    if (!config.entities) {
      throw new Error('Please define entities');
    }
    this.config = config;
  }

  protected render() {
    if (!this.config || !this.hass) {
      return html``;
    }

    const { entities } = this.config;
    
    const solarProduction = this.hass.states[entities.solar_production]?.state || '0';
    const batteryLevel = this.hass.states[entities.battery_level]?.state || '0';
    const batteryPower = this.hass.states[entities.battery_power]?.state || '0';
    const gridPower = this.hass.states[entities.grid_power]?.state || '0';
    const consumption = this.hass.states[entities.consumption]?.state || '0';

    return html`
      <ha-card>
        <div class="card-header">
          <div class="name">${this.config.title || 'Solar Production'}</div>
          <div class="current-power">
            ${solarProduction} W
          </div>
        </div>
        
        <div class="card-content">
          <div class="grid">
            <div class="status-card">
              <span class="label">Solar</span>
              <span class="value">${solarProduction} W</span>
            </div>
            <div class="status-card">
              <span class="label">Battery</span>
              <span class="value">${batteryLevel}%</span>
              <span class="sub-value">${batteryPower} W</span>
            </div>
            <div class="status-card">
              <span class="label">Grid</span>
              <span class="value ${Number(gridPower) > 0 ? 'positive' : 'negative'}">
                ${Math.abs(Number(gridPower))} W
                ${Number(gridPower) > 0 ? 'Import' : 'Export'}
              </span>
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sofar-power-flow-card': SofarPowerFlowCard;
  }
}
