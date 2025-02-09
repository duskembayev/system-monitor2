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