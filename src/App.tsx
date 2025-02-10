import React, { useState, useEffect } from 'react';
import { Sun, Moon, LayoutGrid, Table2, RefreshCw, Tv, MinimizeIcon } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';
import { Environment, Component, ViewType, ComponentUpdate } from './types';
import { EnvironmentTabs } from './components/EnvironmentTabs';
import { ComponentTable } from './components/ComponentTable';
import { ComponentCards } from './components/ComponentCards';
import { mockApi } from './services/mockApi';

const environments: Environment[] = ['DEV', 'STG', 'PROD'];

function Dashboard() {
  const { isDark, toggleTheme } = useTheme();
  const [selectedEnv, setSelectedEnv] = useState<Environment>('PROD');
  const [viewType, setViewType] = useState<ViewType>('table');
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<ComponentUpdate | null>(null);
  const [isTvMode, setIsTvMode] = useState(false);

  const fetchComponents = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getComponents(selectedEnv);
      setComponents(data);
    } catch (error) {
      console.error('Error fetching components:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await mockApi.refreshComponents(selectedEnv);
      setComponents(data);
    } catch (error) {
      console.error('Error refreshing components:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, [selectedEnv]);

  useEffect(() => {
    const unsubscribe = mockApi.subscribeToUpdates((update) => {
      if (update.environment === selectedEnv) {
        setComponents(prev => prev.map(component => {
          if (component.name === update.componentName) {
            const updated = { ...component };
            switch (update.type) {
              case 'health':
                updated.health = update.newValue as Component['health'];
                break;
              case 'replicas':
                updated.readyReplicas = update.newValue as number;
                break;
              case 'version':
                updated.actualVersion = update.newValue as string;
                break;
            }
            return updated;
          }
          return component;
        }));
        setLastUpdate(update);
      }
    });

    return () => unsubscribe();
  }, [selectedEnv]);

  // Toggle TV mode with 't' key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 't') {
        setIsTvMode(prev => !prev);
        setViewType('cards'); // Force cards view in TV mode
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  if (isTvMode) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10 p-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {selectedEnv} Environment Status
          </h1>
          <button
            onClick={() => setIsTvMode(false)}
            className="p-2 rounded-lg bg-white dark:bg-gray-700 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            title="Exit TV Mode"
          >
            <MinimizeIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        <div className="pt-20 h-screen">
          <ComponentCards components={components} tvMode={true} />
        </div>
      </div>
    );
  }

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
              onClick={handleRefresh}
              disabled={refreshing}
              className={`p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg ${
                refreshing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 text-blue-500 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsTvMode(true)}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              title="TV Mode"
            >
              <Tv className="w-5 h-5 text-purple-500" />
            </button>
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
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedEnv} Components
                </h2>
                {loading && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Loading...
                  </div>
                )}
              </div>
              {lastUpdate && (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 animate-fade-out">
                  Last update: {lastUpdate.componentName} - {lastUpdate.type} changed from {lastUpdate.oldValue} to {lastUpdate.newValue}
                </div>
              )}
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : viewType === 'table' ? (
              <ComponentTable components={components} />
            ) : (
              <ComponentCards components={components} tvMode={false} />
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