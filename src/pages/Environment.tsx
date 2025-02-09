import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Component } from '../types';
import { ComponentList } from '../components/ComponentList';

// Mock data - replace with actual API calls
const mockComponents: Component[] = [
  {
    name: 'User Service',
    health: 'Healthy',
    readyReplicas: 3,
    desiredReplicas: 3,
    actualVersion: 'v1.2.3',
    latestVersion: 'v1.2.3'
  },
  {
    name: 'Payment Service',
    health: 'Degraded',
    readyReplicas: 2,
    desiredReplicas: 3,
    actualVersion: 'v2.0.1',
    latestVersion: 'v2.1.0'
  },
  {
    name: 'Notification Service',
    health: 'Unhealthy',
    readyReplicas: 0,
    desiredReplicas: 2,
    actualVersion: 'v1.0.0',
    latestVersion: 'v1.1.0'
  }
];

export const Environment: React.FC = () => {
  const { env } = useParams<{ env: string }>();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">
            {env?.toUpperCase()} Environment
          </h1>
        </div>
        <ComponentList components={mockComponents} />
      </div>
    </div>
  );
};