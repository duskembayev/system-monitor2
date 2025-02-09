import React from 'react';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Component } from '../types';

interface Props {
  components: Component[];
}

const getHealthIcon = (health: Component['health']) => {
  switch (health) {
    case 'Healthy':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'Degraded':
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    case 'Unhealthy':
      return <XCircle className="w-5 h-5 text-red-500" />;
  }
};

const isOutdated = (actual: string, latest: string) => {
  // Remove 'v' prefix and split into parts
  const actualParts = actual.replace('v', '').split('.').map(Number);
  const latestParts = latest.replace('v', '').split('.').map(Number);

  // Compare version numbers
  for (let i = 0; i < Math.max(actualParts.length, latestParts.length); i++) {
    const actualPart = actualParts[i] || 0;
    const latestPart = latestParts[i] || 0;
    if (actualPart < latestPart) return true;
    if (actualPart > latestPart) return false;
  }
  return false;
};

export const ComponentTable: React.FC<Props> = ({ components }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Component
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Replicas
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Current Version
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Latest Version
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {components.map((component) => (
            <tr key={component.name} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {getHealthIcon(component.health)}
                  <span className="ml-2 text-sm text-gray-900 dark:text-gray-300">
                    {component.health}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {component.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {component.readyReplicas}/{component.desiredReplicas}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm font-medium ${
                  isOutdated(component.actualVersion, component.latestVersion)
                    ? 'text-amber-600 dark:text-amber-500'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {component.actualVersion}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {component.latestVersion}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};