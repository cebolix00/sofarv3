import { css } from 'lit';

export const styles = css`
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
`;
