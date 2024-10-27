class SofarPowerFlowCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.selectedView = 'daily';
  }

  static getStubConfig() {
    return {
      entities: {
        solar_production: 'sensor.solar_power',
        battery_level: 'sensor.battery_level',
        battery_power: 'sensor.battery_power',
        grid_power: 'sensor.grid_power',
        consumption: 'sensor.home_consumption',
        // Additional statistics sensors
        daily_yield: 'sensor.solar_daily_yield',
        monthly_yield: 'sensor.solar_monthly_yield',
        yearly_yield: 'sensor.solar_yearly_yield',
        total_yield: 'sensor.solar_total_yield'
      }
    };
  }

  setConfig(config) {
    if (!config.entities) {
      throw new Error('Please define entities');
    }
    this.config = config;
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  calculateStatistics() {
    const { entities } = this.config;
    const states = this._hass.states;

    return {
      daily: {
        solar: states[entities.daily_yield]?.state || '0',
        batteryCharge: states[entities.battery_power]?.attributes?.daily_charge || '0',
        batteryDischarge: states[entities.battery_power]?.attributes?.daily_discharge || '0',
        gridImport: states[entities.grid_power]?.attributes?.daily_import || '0',
        gridExport: states[entities.grid_power]?.attributes?.daily_export || '0',
        consumption: states[entities.consumption]?.attributes?.daily_consumption || '0'
      },
      monthly: {
        solar: states[entities.monthly_yield]?.state || '0',
        batteryCharge: states[entities.battery_power]?.attributes?.monthly_charge || '0',
        batteryDischarge: states[entities.battery_power]?.attributes?.monthly_discharge || '0',
        gridImport: states[entities.grid_power]?.attributes?.monthly_import || '0',
        gridExport: states[entities.grid_power]?.attributes?.monthly_export || '0',
        consumption: states[entities.consumption]?.attributes?.monthly_consumption || '0'
      },
      yearly: {
        solar: states[entities.yearly_yield]?.state || '0',
        batteryCharge: states[entities.battery_power]?.attributes?.yearly_charge || '0',
        batteryDischarge: states[entities.battery_power]?.attributes?.yearly_discharge || '0',
        gridImport: states[entities.grid_power]?.attributes?.yearly_import || '0',
        gridExport: states[entities.grid_power]?.attributes?.yearly_export || '0',
        consumption: states[entities.consumption]?.attributes?.yearly_consumption || '0'
      },
      total: {
        solar: states[entities.total_yield]?.state || '0'
      }
    };
  }

  handleViewChange(event) {
    this.selectedView = event.target.value;
    this.render();
  }

  getStatisticsCard(stats, period) {
    return `
      <div class="statistics-card">
        <div class="statistics-header">
          <div class="label">${period} Statistics</div>
        </div>
        <div class="statistics-grid">
          <div class="stat-item">
            <div class="label">Solar Production</div>
            <div class="value positive">${stats.solar} kWh</div>
          </div>
          <div class="stat-item">
            <div class="label">Consumption</div>
            <div class="value">${stats.consumption} kWh</div>
          </div>
          <div class="stat-item">
            <div class="label">Grid Import</div>
            <div class="value negative">${stats.gridImport} kWh</div>
          </div>
          <div class="stat-item">
            <div class="label">Grid Export</div>
            <div class="value positive">${stats.gridExport} kWh</div>
          </div>
          <div class="stat-item">
            <div class="label">Battery Charge</div>
            <div class="value neutral">${stats.batteryCharge} kWh</div>
          </div>
          <div class="stat-item">
            <div class="label">Battery Discharge</div>
            <div class="value neutral">${stats.batteryDischarge} kWh</div>
          </div>
        </div>
      </div>
    `;
  }

  getStyles() {
    return `
      /* Previous styles remain the same */

      .view-selector {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
      }

      .view-button {
        flex: 1;
        padding: 8px;
        background: var(--card-background-color);
        border: 1px solid var(--card-border-color);
        border-radius: 4px;
        color: var(--primary-text-color);
        cursor: pointer;
      }

      .view-button.active {
        background: var(--primary-color);
        color: var(--text-primary-color);
      }

      .statistics-card {
        background: rgba(var(--rgb-primary-color), 0.05);
        border-radius: 8px;
        padding: 16px;
        margin-top: 16px;
        border: 1px solid var(--card-border-color);
      }

      .statistics-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        margin-top: 8px;
      }

      .stat-item {
        padding: 8px;
        background: var(--card-background-color);
        border-radius: 4px;
      }

      .total-yield {
        text-align: center;
        margin-top: 16px;
        padding: 16px;
        background: var(--card-background-color);
        border-radius: 8px;
        border: 1px solid var(--card-border-color);
      }
    `;
  }

  render() {
    if (!this.config || !this._hass) return;

    const { entities } = this.config;
    const stats = this.calculateStatistics();
    
    // Current values
    const solarProduction = this._hass.states[entities.solar_production]?.state || '0';
    const batteryLevel = this._hass.states[entities.battery_level]?.state || '0';
    const batteryPower = this._hass.states[entities.battery_power]?.state || '0';
    const gridPower = this._hass.states[entities.grid_power]?.state || '0';
    const consumption = this._hass.states[entities.consumption]?.state || '0';

    this.shadowRoot.innerHTML = `
      <ha-card>
        <style>${this.getStyles()}</style>
        
        <div class="card-header">
          <div class="title">${this.config.title || 'Solar Production'}</div>
          <div class="value positive">${solarProduction} W</div>
        </div>

        <!-- Current Status Cards -->
        <div class="grid">
          <!-- Previous status cards remain the same -->
        </div>

        <!-- View Selector -->
        <div class="view-selector">
          <button class="view-button ${this.selectedView === 'daily' ? 'active' : ''}" 
                  value="daily" @click="${this.handleViewChange}">Daily</button>
          <button class="view-button ${this.selectedView === 'monthly' ? 'active' : ''}" 
                  value="monthly" @click="${this.handleViewChange}">Monthly</button>
          <button class="view-button ${this.selectedView === 'yearly' ? 'active' : ''}" 
                  value="yearly" @click="${this.handleViewChange}">Yearly</button>
        </div>

        <!-- Statistics View -->
        ${this.selectedView === 'daily' ? this.getStatisticsCard(stats.daily, 'Daily') : ''}
        ${this.selectedView === 'monthly' ? this.getStatisticsCard(stats.monthly, 'Monthly') : ''}
        ${this.selectedView === 'yearly' ? this.getStatisticsCard(stats.yearly, 'Yearly') : ''}

        <!-- Total Yield -->
        <div class="total-yield">
          <div class="label">Total Lifetime Production</div>
          <div class="value positive">${stats.total.solar} kWh</div>
        </div>
      </ha-card>
    `;

    // Add event listeners after rendering
    this.shadowRoot.querySelectorAll('.view-button').forEach(button => {
      button.addEventListener('click', (e) => this.handleViewChange(e));
    });
  }
}

customElements.define('sofar-power-flow-card', SofarPowerFlowCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "sofar-power-flow-card",
  name: "Sofar Power Flow Card",
  preview: true,
  description: "Comprehensive solar monitoring card with statistics"
});
