import React from 'react';
import { Monitor } from 'lucide-react';
import { Environment } from '../types';

interface Props {
  env: Environment;
  onClick: (env: Environment) => void;
}

export const EnvironmentCard: React.FC<Props> = ({ env, onClick }) => {
  return (
    <div
      onClick={() => onClick(env)}
      className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
    >
      <div className="flex items-center justify-between">
        <Monitor className="w-8 h-8 text-blue-500" />
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{env}</span>
      </div>
      <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
        {env} Environment
      </h3>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        View all components and their status
      </p>
    </div>
  );
};