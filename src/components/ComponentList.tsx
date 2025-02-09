import React from 'react';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Component } from '../types';

interface Props {
  components: Component[];
}

const getHealthIcon = (health: Component['health']) => {
  switch (health) {
    case 'Healthy':
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    case 'Degraded':
      return <AlertCircle className="w-6 h-6 text-yellow-500" />;
    case 'Unhealthy':
      return <XCircle className="w-6 h-6 text-red-500" />;
  }
};

export const ComponentList: React.FC<Props> = ({ components }) => {
  return (
    <div className="grid gap-4">
      {components.map((component) => (
        <div
          key={component.name}
          className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getHealthIcon(component.health)}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {component.name}
              </h3>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {component.readyReplicas}/{component.desiredReplicas} replicas
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Current Version
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                {component.actualVersion}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Latest Version
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                {component.latestVersion}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};