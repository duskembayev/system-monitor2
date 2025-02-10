import { Component, Environment, ComponentUpdate } from '../types';

// Helper function to generate version strings
const generateVersion = (major: number, minor: number, patch: number): string => {
  return `v${major}.${minor}.${patch}`;
};

// Helper function to generate random health status
const generateHealth = (): Component['health'] => {
  const random = Math.random();
  if (random > 0.85) return 'Unhealthy';
  if (random > 0.7) return 'Degraded';
  return 'Healthy';
};

// Generate component data
const generateComponents = (count: number, isProduction: boolean): Component[] => {
  const services = [
    'Authentication', 'User', 'Payment', 'Notification', 'Analytics', 'Search',
    'Cache', 'Email', 'Storage', 'Queue', 'Logger', 'Metrics', 'Gateway',
    'Database', 'CDN', 'Security', 'Backup', 'Monitoring', 'Scheduler',
    'Translation', 'Chat', 'Video', 'Audio', 'Image', 'Document',
    'Workflow', 'Integration', 'API', 'Mobile', 'Web', 'Desktop',
    'ML', 'AI', 'Blockchain', 'IoT', 'AR', 'VR', 'Gaming', 'Social',
    'CRM', 'ERP', 'CMS', 'LMS', 'HRM', 'POS', 'Inventory', 'Shipping',
    'Billing', 'Tax', 'Accounting', 'Reports', 'Dashboard'
  ];

  return Array.from({ length: count }, (_, index) => {
    const serviceIndex = index % services.length;
    const serviceName = `${services[serviceIndex]} Service`;
    
    const major = Math.floor(Math.random() * 3) + 1;
    const minor = Math.floor(Math.random() * 5);
    const patch = Math.floor(Math.random() * 10);
    
    const actualVersion = generateVersion(major, minor, patch);
    const latestVersion = Math.random() > 0.7 
      ? generateVersion(major, minor + 1, 0)
      : actualVersion;

    const desiredReplicas = isProduction 
      ? Math.floor(Math.random() * 3) + 3  // 3-5 for prod
      : Math.floor(Math.random() * 2) + 1; // 1-2 for non-prod
    
    const health = generateHealth();
    const readyReplicas = health === 'Healthy' 
      ? desiredReplicas 
      : health === 'Degraded'
        ? desiredReplicas - 1
        : 0;

    return {
      name: serviceName,
      health,
      readyReplicas,
      desiredReplicas,
      actualVersion,
      latestVersion
    };
  });
};

// Mock database
const mockDb: Record<Environment, Component[]> = {
  'DEV': generateComponents(50, false),
  'STG': generateComponents(50, false),
  'PROD': generateComponents(50, true)
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// WebSocket event emitter
class WebSocketEmitter {
  private listeners: Set<(update: ComponentUpdate) => void> = new Set();
  private intervalId: number | null = null;

  subscribe(callback: (update: ComponentUpdate) => void) {
    this.listeners.add(callback);
    
    // Start emitting if this is the first subscriber
    if (this.listeners.size === 1) {
      this.startEmitting();
    }

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
      if (this.listeners.size === 0) {
        this.stopEmitting();
      }
    };
  }

  private startEmitting() {
    this.intervalId = window.setInterval(() => {
      Object.entries(mockDb).forEach(([env, components]) => {
        // Randomly select a component to update
        const componentIndex = Math.floor(Math.random() * components.length);
        const component = components[componentIndex];

        // Generate random update
        const updateType = Math.random();
        let update: ComponentUpdate;

        if (updateType < 0.4) { // 40% chance of health change
          const newHealth = generateHealth();
          if (newHealth !== component.health) {
            update = {
              environment: env as Environment,
              componentName: component.name,
              type: 'health',
              oldValue: component.health,
              newValue: newHealth
            };
            component.health = newHealth;

            // Update replicas based on new health
            if (newHealth === 'Healthy') {
              component.readyReplicas = component.desiredReplicas;
            } else if (newHealth === 'Degraded') {
              component.readyReplicas = Math.max(0, component.desiredReplicas - 1);
            } else {
              component.readyReplicas = 0;
            }
          }
        } else if (updateType < 0.7) { // 30% chance of replica change
          const oldReplicas = component.readyReplicas;
          const maxChange = component.health === 'Healthy' ? 1 : -1;
          const newReplicas = Math.min(
            component.desiredReplicas,
            Math.max(0, oldReplicas + maxChange)
          );

          if (newReplicas !== oldReplicas) {
            update = {
              environment: env as Environment,
              componentName: component.name,
              type: 'replicas',
              oldValue: oldReplicas,
              newValue: newReplicas
            };
            component.readyReplicas = newReplicas;
          }
        } else { // 30% chance of version update
          const currentParts = component.actualVersion.replace('v', '').split('.').map(Number);
          const newPatch = currentParts[2] + 1;
          const newVersion = generateVersion(currentParts[0], currentParts[1], newPatch);

          if (newVersion !== component.actualVersion) {
            update = {
              environment: env as Environment,
              componentName: component.name,
              type: 'version',
              oldValue: component.actualVersion,
              newValue: newVersion
            };
            component.actualVersion = newVersion;
          }
        }

        // Emit update if one was generated
        if (update) {
          this.listeners.forEach(listener => listener(update));
        }
      });
    }, 2000); // Emit updates every 2 seconds
  }

  private stopEmitting() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

// Create a single WebSocket emitter instance
const wsEmitter = new WebSocketEmitter();

// Mock API service
export const mockApi = {
  getComponents: async (env: Environment): Promise<Component[]> => {
    await delay(800); // Simulate network latency
    return mockDb[env];
  },

  refreshComponents: async (env: Environment): Promise<Component[]> => {
    await delay(500);
    mockDb[env] = generateComponents(50, env === 'PROD');
    return mockDb[env];
  },

  // WebSocket-like subscription
  subscribeToUpdates: (callback: (update: ComponentUpdate) => void) => {
    return wsEmitter.subscribe(callback);
  }
};