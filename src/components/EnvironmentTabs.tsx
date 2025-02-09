import React from 'react';
import { Environment } from '../types';

interface Props {
  environments: Environment[];
  selectedEnv: Environment;
  onSelect: (env: Environment) => void;
}

export const EnvironmentTabs: React.FC<Props> = ({ environments, selectedEnv, onSelect }) => {
  return (
    <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
      {environments.map((env) => (
        <button
          key={env}
          onClick={() => onSelect(env)}
          className={`
            flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all
            ${selectedEnv === env
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }
          `}
        >
          {env}
        </button>
      ))}
    </div>
  );
};