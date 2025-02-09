import React, { useState } from 'react';
import { Sun, Moon, LayoutGrid, Table2 } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';
import { Environment, Component, ViewType } from './types';
import { EnvironmentTabs } from './components/EnvironmentTabs';
import { ComponentTable } from './components/ComponentTable';
import { ComponentCards } from './components/ComponentCards';

const environments: Environment[] = ['DEV', 'STG', 'PROD'];

// Mock data for different environments
const mockComponentsByEnv: Record<Environment, Component[]> = {
  DEV: [
    {
      name: 'User Service',
      health: 'Healthy',
      readyReplicas: 2,
      desiredReplicas: 2,
      actualVersion: 'v1.3.0',
      latestVersion: 'v1.3.0'
    },
    {
      name: 'Payment Service',
      health: 'Degraded',
      readyReplicas: 1,
      desiredReplicas: 2,
      actualVersion: 'v2.1.0',
      latestVersion: 'v2.1.0'
    },
    {
      name: 'Notification Service',
      health: 'Healthy',
      readyReplicas: 2,
      desiredReplicas: 2,
      actualVersion: 'v1.1.0',
      latestVersion: 'v1.2.0'
    },
    {
      name: 'Analytics Service',
      health: 'Unhealthy',
      readyReplicas: 0,
      desiredReplicas: 1,
      actualVersion: 'v0.9.0',
      latestVersion: 'v1.0.0'
    },
    {
      name: 'Search Service',
      health: 'Healthy',
      readyReplicas: 1,
      desiredReplicas: 1,
      actualVersion: 'v1.0.0',
      latestVersion: 'v1.0.0'
    }
  ],
  STG: [
    {
      name: 'User Service',
      health: 'Healthy',
      readyReplicas: 3,
      desiredReplicas: 3,
      actualVersion: 'v1.2.3',
      latestVersion: 'v1.3.0'
    },
    {
      name: 'Payment Service',
      health: 'Healthy',
      readyReplicas: 2,
      desiredReplicas: 2,
      actualVersion: 'v2.0.1',
      latestVersion: 'v2.1.0'
    },
    {
      name: 'Notification Service',
      health: 'Degraded',
      readyReplicas: 2,
      desiredReplicas: 3,
      actualVersion: 'v1.0.0',
      latestVersion: 'v1.2.0'
    },
    {
      name: 'Analytics Service',
      health: 'Healthy',
      readyReplicas: 2,
      desiredReplicas: 2,
      actualVersion: 'v0.9.0',
      latestVersion: 'v1.0.0'
    },
    {
      name: 'Search Service',
      health: 'Healthy',
      readyReplicas: 2,
      desiredReplicas: 2,
      actualVersion: 'v0.9.5',
      latestVersion: 'v1.0.0'
    },
    {
      name: 'Cache Service',
      health: 'Healthy',
      readyReplicas: 2,
      desiredReplicas: 2,
      actualVersion: 'v1.1.0',
      latestVersion: 'v1.1.0'
    }
  ],
  PROD: [
    {
      name: 'User Service',
      health: 'Healthy',
      readyReplicas: 5,
      desiredReplicas: 5,
      actualVersion: 'v1.2.3',
      latestVersion: 'v1.3.0'
    },
    {
      name: 'Payment Service',
      health: 'Healthy',
      readyReplicas: 3,
      desiredReplicas: 3,
      actualVersion: 'v2.0.1',
      latestVersion: 'v2.1.0'
    },
    {
      name: 'Notification Service',
      health: 'Healthy',
      readyReplicas: 4,
      desiredReplicas: 4,
      actualVersion: 'v1.0.0',
      latestVersion: 'v1.2.0'
    },
    {
      name: 'Analytics Service',
      health: 'Healthy',
      readyReplicas: 3,
      desiredReplicas: 3,
      actualVersion: 'v0.9.0',
      latestVersion: 'v1.0.0'
    },
    {
      name: 'Search Service',
      health: 'Degraded',
      readyReplicas: 4,
      desiredReplicas: 5,
      actualVersion: 'v0.9.5',
      latestVersion: 'v1.0.0'
    },
    {
      name: 'Cache Service',
      health: 'Healthy',
      readyReplicas: 3,
      desiredReplicas: 3,
      actualVersion: 'v1.1.0',
      latestVersion: 'v1.1.0'
    },
    {
      name: 'Authentication Service',
      health: 'Healthy',
      readyReplicas: 4,
      desiredReplicas: 4,
      actualVersion: 'v1.5.0',
      latestVersion: 'v1.5.0'
    }
  ]
};

function Dashboard() {
  const { isDark, toggleTheme } = useTheme();
  const [selectedEnv, setSelectedEnv] = useState<Environment>('PROD');
  const [viewType, setViewType] = useState<ViewType>('table');

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            System Monitor
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1">
              <button
                onClick={() => setViewType('table')}
                className={`p-2 rounded-md transition-colors ${
                  viewType === 'table'
                    ? 'bg-gray-100 dark:bg-gray-700'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                title="Table View"
              >
                <Table2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={() => setViewType('cards')}
                className={`p-2 rounded-md transition-colors ${
                  viewType === 'cards'
                    ? 'bg-gray-100 dark:bg-gray-700'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                title="Card View"
              >
                <LayoutGrid className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
            >
              {isDark ? (
                <Sun className="w-6 h-6 text-yellow-500" />
              ) : (
                <Moon className="w-6 h-6 text-blue-500" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <EnvironmentTabs
            environments={environments}
            selectedEnv={selectedEnv}
            onSelect={setSelectedEnv}
          />
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedEnv} Components
              </h2>
            </div>
            {viewType === 'table' ? (
              <ComponentTable components={mockComponentsByEnv[selectedEnv]} />
            ) : (
              <ComponentCards components={mockComponentsByEnv[selectedEnv]} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;