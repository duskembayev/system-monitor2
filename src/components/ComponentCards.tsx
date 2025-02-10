import React, { useEffect, useRef, useState } from 'react';
import { Component } from '../types';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface Props {
  components: Component[];
  tvMode: boolean;
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

export const ComponentCards: React.FC<Props> = ({ components, tvMode }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number>();
  const cardsPerPage = tvMode ? 15 : 12;
  const totalPages = Math.ceil(components.length / cardsPerPage);

  const goToPage = (pageIndex: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setStartIndex(pageIndex * cardsPerPage);
      setIsTransitioning(false);
    }, 300);

    // Reset the auto-transition timer
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      startAutoTransition();
    }
  };

  const startAutoTransition = () => {
    const interval = tvMode ? 10000 : 15000;
    timerRef.current = window.setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setStartIndex((current) => 
          current + cardsPerPage >= components.length ? 0 : current + cardsPerPage
        );
        setIsTransitioning(false);
      }, 300);
    }, interval);
    return timerRef.current;
  };

  // Calculate cards per page based on container size
  useEffect(() => {
    if (tvMode && containerRef.current) {
      const updateCardsLayout = () => {
        const container = containerRef.current;
        if (!container) return;

        // Force a reflow to ensure proper sizing
        container.style.display = 'none';
        container.offsetHeight; // trigger reflow
        container.style.display = 'grid';
      };

      updateCardsLayout();
      window.addEventListener('resize', updateCardsLayout);
      return () => window.removeEventListener('resize', updateCardsLayout);
    }
  }, [tvMode]);

  useEffect(() => {
    if (totalPages > 1) {
      const timerId = startAutoTransition();
      return () => window.clearInterval(timerId);
    }
  }, [components.length, tvMode, cardsPerPage, totalPages]);

  const visibleComponents = components.slice(startIndex, startIndex + cardsPerPage);
  const currentPage = Math.floor(startIndex / cardsPerPage);

  const gridClass = tvMode
    ? "grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 4k:grid-cols-8 gap-4 auto-rows-fr"
    : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 4k:grid-cols-6 gap-4";

  return (
    <div className={`${tvMode ? "h-[calc(100vh-6rem)]" : "p-6"}`}>
      <StatusLine components={components} />
      
      <div 
        ref={containerRef}
        className={`${gridClass} transition-all duration-300 ${
          isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        style={{ height: tvMode ? 'calc(100% - 4rem)' : 'auto' }}
      >
        {visibleComponents.map((component) => (
          <div
            key={component.name}
            className={`rounded-lg border p-3 transition-all ${getHealthColor(component.health)} ${
              tvMode ? 'flex flex-col' : ''
            }`}
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

            <div className="grid grid-cols-2 gap-2 mt-auto">
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
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentPage === i
                  ? 'bg-blue-500 scale-125'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              title={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};