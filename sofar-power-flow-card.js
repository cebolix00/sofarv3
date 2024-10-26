import{css as r,LitElement as a,html as e}from"lit";import{property as t,customElement as s}from"lit/decorators.js";function o(r,a,e,t){var s,o=arguments.length,i=o<3?a:null===t?t=Object.getOwnPropertyDescriptor(a,e):t;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(r,a,e,t);else for(var c=r.length-1;c>=0;c--)(s=r[c])&&(i=(o<3?s(i):o>3?s(a,e,i):s(a,e))||i);return o>3&&i&&Object.defineProperty(a,e,i),i}"function"==typeof SuppressedError&&SuppressedError;const i=r`
  :host {
    --ha-card-background: var(--card-background-color, #0E1013);
    --ha-card-border-color: var(--divider-color, #1D2027);
    --ha-card-box-shadow: none;
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

  .current-power {
    font-size: 1.1rem;
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
    display: flex;
    flex-direction: column;
  }

  .label {
    font-size: 0.9rem;
    color: var(--secondary-text-color);
  }

  .value {
    font-size: 1.5rem;
    font-weight: 500;
    margin: 8px 0;
    color: var(--primary-text-color);
  }

  .sub-value {
    font-size: 0.9rem;
    color: var(--secondary-text-color);
  }

  .value.positive {
    color: var(--success-color, #4CAF50);
  }

  .value.negative {
    color: var(--warning-color, #FF9800);
  }
`;let c=class extends a{setConfig(r){if(!r.entities)throw new Error("Please define entities");this.config=r}render(){var r,a,t,s,o;if(!this.config||!this.hass)return e``;const{entities:i}=this.config,c=(null===(r=this.hass.states[i.solar_production])||void 0===r?void 0:r.state)||"0",d=(null===(a=this.hass.states[i.battery_level])||void 0===a?void 0:a.state)||"0",l=(null===(t=this.hass.states[i.battery_power])||void 0===t?void 0:t.state)||"0",n=(null===(s=this.hass.states[i.grid_power])||void 0===s?void 0:s.state)||"0";return null===(o=this.hass.states[i.consumption])||void 0===o||o.state,e`
      <ha-card>
        <div class="card-header">
          <div class="name">${this.config.title||"Solar Production"}</div>
          <div class="current-power">
            ${c} W
          </div>
        </div>
        
        <div class="card-content">
          <div class="grid">
            <div class="status-card">
              <span class="label">Solar</span>
              <span class="value">${c} W</span>
            </div>
            <div class="status-card">
              <span class="label">Battery</span>
              <span class="value">${d}%</span>
              <span class="sub-value">${l} W</span>
            </div>
            <div class="status-card">
              <span class="label">Grid</span>
              <span class="value ${Number(n)>0?"positive":"negative"}">
                ${Math.abs(Number(n))} W
                ${Number(n)>0?"Import":"Export"}
              </span>
            </div>
          </div>
        </div>
      </ha-card>
    `}};c.styles=i,o([t({attribute:!1})],c.prototype,"hass",void 0),o([t({attribute:!1})],c.prototype,"config",void 0),c=o([s("sofar-power-flow-card")],c);export{c as SofarPowerFlowCard};
//# sourceMappingURL=sofar-power-flow-card.js.map
