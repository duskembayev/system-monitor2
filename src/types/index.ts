export type Environment = 'DEV' | 'STG' | 'PROD';
export type ViewType = 'table' | 'cards';

export interface Component {
  name: string;
  health: 'Healthy' | 'Degraded' | 'Unhealthy';
  readyReplicas: number;
  desiredReplicas: number;
  actualVersion: string;
  latestVersion: string;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export type UpdateType = 'health' | 'replicas' | 'version';

export interface ComponentUpdate {
  environment: Environment;
  componentName: string;
  type: UpdateType;
  oldValue: string | number;
  newValue: string | number;
}