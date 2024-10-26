export interface HomeAssistant {
  states: {
    [key: string]: EntityData;
  };
  callService: (domain: string, service: string, data: any) => Promise<void>;
  callApi: <T>(method: string, path: string, data?: any) => Promise<T>;
}

export interface EntityData {
  state: string;
  attributes: {
    unit_of_measurement?: string;
    friendly_name?: string;
    [key: string]: any;
  };
  last_changed: string;
  last_updated: string;
  context: {
    id: string;
    user_id: string | null;
  };
}

export {};
