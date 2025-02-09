import React, { useEffect, useRef, useState } from 'react';
import { Component } from '../types';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface Props {
  components: Component[];
}

const getHealthColor = (health: Component['health']) => {
  switch (health) {
    case 'Healthy':
      return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900';
    case 'Degraded':
      return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900';
    case 'Unhealthy':
      return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900';
  }
};

const getHealthIcon = (health: Component['health']) => {
  switch (health) {
    case 'Healthy':
      return <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />;
    case 'Degraded':
      return <AlertCircle className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />;
    case 'Unhealthy':
      return <XCircle className="w-4 h-4 text-red-500 dark:text-red-400" />;
  }
};

const isOutdated = (actual: string, latest: string) => {
  const actualParts = actual.replace('v', '').split('.').map(Number);
  const latestParts = latest.replace('v', '').split('.').map(Number);

  for (let i = 0; i < Math.max(actualParts.length, latestParts.length); i++) {
    const actualPart = actualParts[i] || 0;
    const latestPart = latestParts[i] || 0;
    if (actualPart < latestPart) return true;
    if (actualPart > latestPart) return false;
  }
  return false;
};

const StatusLine: React.FC<{ components: Component[] }> = ({ components }) => {
  const total = components.length;
  const healthy = components.filter(c => c.health === 'Healthy').length;
  const degraded = components.filter(c => c.health === 'Degraded').length;
  const unhealthy = components.filter(c => c.health === 'Unhealthy').length;

  const healthyWidth = (healthy / total) * 100;
  const degradedWidth = (degraded / total) * 100;
  const unhealthyWidth = (unhealthy / total) * 100;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
          System Health Status
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {healthy} Healthy • {degraded} Degraded • {unhealthy} Unhealthy
        </div>
      </div>
      <div className="h-2 flex rounded-full overflow-hidden">
        {healthyWidth > 0 && (
          <div 
            className="bg-green-500 transition-all duration-500" 
            style={{ width: `${healthyWidth}%` }}
          />
        )}
        {degradedWidth > 0 && (
          <div 
            className="bg-yellow-500 transition-all duration-500" 
            style={{ width: `${degradedWidth}%` }}
          />
        )}
        {unhealthyWidth > 0 && (
          <div 
            className="bg-red-500 transition-all duration-500" 
            style={{ width: `${unhealthyWidth}%` }}
          />
        )}
      </div>
    </div>
  );
};

export const ComponentCards: React.FC<Props> = ({ components }) => {
  const [startIndex, setStartIndex] = useState(0);
  const cardsPerPage = 12; // Adjust based on screen size
  const totalPages = Math.ceil(components.length / cardsPerPage);

  useEffect(() => {
    const timer = setInterval(() => {
      setStartIndex((current) => (current + cardsPerPage >= components.length ? 0 : current + cardsPerPage));
    }, 10000);

    return () => clearInterval(timer);
  }, [components.length]);

  const visibleComponents = components.slice(startIndex, startIndex + cardsPerPage);

  return (
    <div className="p-6">
      <StatusLine components={components} />
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 4k:grid-cols-6 gap-4">
        {visibleComponents.map((component) => (
          <div
            key={component.name}
            className={`rounded-lg border p-3 transition-all ${getHealthColor(component.health)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate" title={component.name}>
                  {component.name}
                </h3>
                <div className="flex items-center space-x-1">
                  {getHealthIcon(component.health)}
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    {component.health}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-gray-900 dark:text-white">
                  {component.readyReplicas}/{component.desiredReplicas}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Current
                </div>
                <div
                  className={`text-xs font-medium ${
                    isOutdated(component.actualVersion, component.latestVersion)
                      ? 'text-amber-600 dark:text-amber-500'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {component.actualVersion}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Latest
                </div>
                <div className="text-xs font-medium text-gray-900 dark:text-white">
                  {component.latestVersion}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-1">
          {Array.from({ length: totalPages }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                Math.floor(startIndex / cardsPerPage) === i
                  ? 'bg-blue-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};