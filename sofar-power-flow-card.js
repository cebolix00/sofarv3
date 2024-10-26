import { LitElement, html, css } from 'https://unpkg.com/lit@2.7.6/index.js?module';
import { customElement, property } from 'https://unpkg.com/lit@2.7.6/decorators.js?module';

console.info(
  '%c SOFAR-POWER-FLOW-CARD %c Version 1.0.0 ',
  'color: white; font-weight: bold; background: #555;',
  'color: white; font-weight: bold; background: #000;'
);

@customElement('sofar-power-flow-card')
class SofarPowerFlowCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {}
    };
  }

  setConfig(config) {
    if (!config.entities) {
      throw new Error('Please define entities');
    }
    this.config = config;
  }

  render() {
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

  static get styles() {
    return css`
      :host {
        --ha-card-background: var(--card-background-color, #0E1013);
        --ha-card-border-color: var(--divider-color, #1D2027);
      }

      ha-card {
        background: var(--ha-card-background);
        border-radius: var(--ha-card-border-radius, 12px);
        border: 1px solid var(--ha-card-border-color);
        padding: 16px;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .name {
        font-size: 1.25rem;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }

      .status-card {
        background: rgba(var(--rgb-primary-color), 0.05);
        padding: 16px;
        border-radius: 8px;
      }

      .label {
        font-size: 0.9rem;
        color: var(--secondary-text-color);
      }

      .value {
        font-size: 1.5rem;
        font-weight: 500;
        margin: 8px 0;
      }

      .value.positive { color: var(--success-color, #4CAF50); }
      .value.negative { color: var(--warning-color, #FF9800); }
    `;
  }
}

if (!customElements.get('sofar-power-flow-card')) {
  customElements.define('sofar-power-flow-card', SofarPowerFlowCard);
}