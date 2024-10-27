class SofarPowerFlowCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.selectedView = 'current';
    this.selectedPeriod = 'daily';
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

  render() {
    if (!this.config || !this._hass) return;

    const solar = this._hass.states[this.config.entities.solar_production]?.state || '0';
    const dailyYield = this._hass.states[this.config.entities.daily_yield]?.state || '0';
    const consumption = this._hass.states[this.config.entities.consumption]?.state || '0';
    const batteryLevel = this._hass.states[this.config.entities.battery_level]?.state || '0';
    const batteryPower = this._hass.states[this.config.entities.battery_power]?.state || '0';
    const gridPower = this._hass.states[this.config.entities.grid_power]?.state || '0';
    const gridExported = this._hass.states[this.config.entities.grid_exported]?.state || '0';
    const gridImported = this._hass.states[this.config.entities.grid_imported]?.state || '0';

    this.shadowRoot.innerHTML = `
      <ha-card>
        <style>
          :host {
            --card-primary-color: var(--primary-color);
            --card-bg-color: var(--ha-card-background, var(--card-background-color));
          }
          .card {
            padding: 16px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: start;
          }
          .title {
            color: var(--secondary-text-color);
          }
          .main-value {
            background: var(--card-bg-color);
            padding: 4px 12px;
            border-radius: 16px;
            border: 1px solid var(--divider-color);
            color: #ffd700;
            font-weight: bold;
          }
          .tabs {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin: 16px 0;
            background: var(--secondary-background-color);
            padding: 4px;
            border-radius: 12px;
          }
          .tab {
            text-align: center;
            padding: 8px;
            cursor: pointer;
            border-radius: 8px;
            color: var(--secondary-text-color);
          }
          .tab.active {
            background: var(--card-bg-color);
            color: var(--primary-text-color);
          }
          .metrics {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 16px;
            margin-bottom: 16px;
          }
          .metric {
            background: var(--card-bg-color);
            padding: 16px;
            border-radius: 12px;
            border: 1px solid var(--divider-color);
          }
          .metric-title {
            color: var(--secondary-text-color);
            margin-bottom: 8px;
            display: flex;
            align-items: center;
          }
          .value {
            font-size: 1.5em;
            font-weight: bold;
            margin: 4px 0;
          }
          .value.solar { color: #ffd700; }
          .value.consumption { color: #60a5fa; }
          .value.battery { color: #34d399; }
          .sub-value {
            font-size: 0.9em;
            color: var(--secondary-text-color);
          }
          .grid-status {
            display: flex;
            justify-content: space-between;
            padding-top: 16px;
            border-top: 1px solid var(--divider-color);
          }
          .export { color: #34d399; }
          .import { color: #ef4444; }
          .period-tabs {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 8px;
            margin: 16px 0;
          }
          .period-tab {
            text-align: center;
            padding: 8px;
            cursor: pointer;
            border-radius: 8px;
            background: var(--secondary-background-color);
            color: var(--secondary-text-color);
          }
          .period-tab.active {
            background: var(--card-primary-color);
            color: var(--primary-text-color);
          }
        </style>
        
        <div class="card">
          <div class="header">
            <div>
              <div class="title">Solar Production</div>
              <div class="subtitle">Forecast & Monitoring</div>
            </div>
            <div class="main-value">${solar} kW</div>
          </div>

          <div class="tabs">
            <div class="tab ${this.selectedView === 'current' ? 'active' : ''}" @click="${() => this.setView('current')}">Current</div>
            <div class="tab ${this.selectedView === 'forecast' ? 'active' : ''}" @click="${() => this.setView('forecast')}">Forecast</div>
          </div>

          <div class="metrics">
            <div class="metric">
              <div class="metric-title">Solar</div>
              <div class="value solar">${dailyYield} kWh</div>
              <div class="sub-value">Today's Total</div>
            </div>

            <div class="metric">
              <div class="metric-title">Consumption</div>
              <div class="value consumption">${consumption} kW</div>
              <div class="sub-value">Current Usage</div>
            </div>

            <div class="metric">
              <div class="metric-title">Battery</div>
              <div class="value battery">${batteryLevel}%</div>
              <div class="sub-value">Charging: ${batteryPower} kW</div>
            </div>
          </div>

          ${this.selectedView === 'current' ? `
            <div class="period-tabs">
              <div class="period-tab ${this.selectedPeriod === 'daily' ? 'active' : ''}" @click="${() => this.setPeriod('daily')}">Daily</div>
              <div class="period-tab ${this.selectedPeriod === 'monthly' ? 'active' : ''}" @click="${() => this.setPeriod('monthly')}">Monthly</div>
              <div class="period-tab ${this.selectedPeriod === 'yearly' ? 'active' : ''}" @click="${() => this.setPeriod('yearly')}">Yearly</div>
            </div>
          ` : ''}

          <div class="grid-status">
            <div class="export">
              Exporting ${Math.abs(Number(gridPower))} kW
            </div>
            <div>
              <div>Today</div>
              <div class="export">Exported: ${gridExported} kWh</div>
              <div class="import">Imported: ${gridImported} kWh</div>
            </div>
          </div>
        </div>
      </ha-card>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const tabs = this.shadowRoot.querySelectorAll('.tab');
    const periodTabs = this.shadowRoot.querySelectorAll('.period-tab');

    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const view = e.target.textContent.toLowerCase();
        this.setView(view);
      });
    });

    periodTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const period = e.target.textContent.toLowerCase();
        this.setPeriod(period);
      });
    });
  }

  setView(view) {
    this.selectedView = view;
    this.render();
  }

  setPeriod(period) {
    this.selectedPeriod = period;
    this.render();
  }
}

customElements.define('sofar-power-flow-card', SofarPowerFlowCard);