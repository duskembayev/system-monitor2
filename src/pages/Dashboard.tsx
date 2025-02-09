import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { Environment } from '../types';
import { EnvironmentCard } from '../components/EnvironmentCard';
import { useTheme } from '../context/ThemeContext';

const environments: Environment[] = ['DEV', 'STG', 'PROD'];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleEnvironmentClick = (env: Environment) => {
    navigate(`/environment/${env.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            System Monitor
          </h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {environments.map((env) => (
            <EnvironmentCard
              key={env}
              env={env}
              onClick={handleEnvironmentClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};