declare namespace chrome {
  export namespace sidePanel {
    export function setPanelBehavior(options: {
      openPanelOnActionClick: boolean;
    }): Promise<void>;

    export function open(options?: {
      windowId?: number;
      tabId?: number;
    }): Promise<void>;

    export function setOptions(options: {
      path?: string;
      enabled?: boolean;
      tabId?: number;
    }): Promise<void>;
  }
}
