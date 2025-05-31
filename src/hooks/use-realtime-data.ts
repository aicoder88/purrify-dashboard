'use client';

import * as React from 'react';
import { RealTimeUpdate, WebSocketConnection } from '@/types';

interface UseRealTimeDataOptions {
  endpoint?: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onUpdate?: (update: RealTimeUpdate) => void;
  onConnectionChange?: (connection: WebSocketConnection) => void;
}

interface UseRealTimeDataReturn {
  connection: WebSocketConnection;
  lastUpdate: RealTimeUpdate | null;
  sendMessage: (message: any) => void;
  disconnect: () => void;
  reconnect: () => void;
}

// Simulated WebSocket for demo purposes
class MockWebSocket {
  private listeners: { [key: string]: Function[] } = {};
  private intervalId: NodeJS.Timeout | null = null;
  public isConnected = false;

  constructor(private url: string) {
    // Simulate connection delay
    setTimeout(() => {
      this.isConnected = true;
      this.emit('open', {});
      this.startDataSimulation();
    }, 1000);
  }

  addEventListener(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  removeEventListener(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  send(data: string) {
    // Simulate sending data
    console.log('Sending data:', data);
  }

  close() {
    this.isConnected = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.emit('close', {});
  }

  private emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  private startDataSimulation() {
    // Simulate real-time updates every 5-15 seconds
    this.intervalId = setInterval(() => {
      if (!this.isConnected) return;

      const updateTypes = ['metric', 'chart', 'notification'] as const;
      const randomType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
      
      let updateData: RealTimeUpdate;

      switch (randomType) {
        case 'metric':
          updateData = {
            type: 'metric',
            id: `metric-${Math.random().toString(36).substr(2, 9)}`,
            data: {
              name: 'Total Sales',
              value: Math.floor(Math.random() * 10000) + 50000,
              change: {
                value: Math.floor(Math.random() * 1000) - 500,
                percentage: (Math.random() * 20) - 10,
                period: 'vs last hour',
                type: Math.random() > 0.5 ? 'increase' : 'decrease',
              },
            },
            timestamp: new Date(),
          };
          break;

        case 'chart':
          updateData = {
            type: 'chart',
            id: `chart-${Math.random().toString(36).substr(2, 9)}`,
            data: {
              dataPoints: Array.from({ length: 7 }, (_, i) => ({
                x: `Day ${i + 1}`,
                y: Math.floor(Math.random() * 1000) + 100,
                label: `Day ${i + 1}`,
              })),
            },
            timestamp: new Date(),
          };
          break;

        case 'notification':
          const notifications = [
            'New order received from Premium Pet Store',
            'Sales target for this month achieved!',
            'Low inventory alert for Purrify Premium',
            'New customer registered: Happy Paws Veterinary',
            'Weekly report is ready for review',
          ];
          updateData = {
            type: 'notification',
            id: `notification-${Math.random().toString(36).substr(2, 9)}`,
            data: {
              title: 'System Update',
              message: notifications[Math.floor(Math.random() * notifications.length)],
              type: Math.random() > 0.7 ? 'warning' : 'info',
            },
            timestamp: new Date(),
          };
          break;

        default:
          updateData = {
            type: 'metric',
            id: `default-${Math.random().toString(36).substr(2, 9)}`,
            data: {},
            timestamp: new Date(),
          };
          break;
      }

      this.emit('message', { data: JSON.stringify(updateData) });
    }, Math.random() * 10000 + 5000); // 5-15 seconds
  }
}

export const useRealTimeData = (options: UseRealTimeDataOptions = {}): UseRealTimeDataReturn => {
  const {
    endpoint = '/api/realtime',
    reconnectInterval = 5000,
    maxReconnectAttempts = 5,
    onUpdate,
    onConnectionChange,
  } = options;

  const [connection, setConnection] = React.useState<WebSocketConnection>({
    isConnected: false,
    reconnectAttempts: 0,
  });

  const [lastUpdate, setLastUpdate] = React.useState<RealTimeUpdate | null>(null);
  const wsRef = React.useRef<MockWebSocket | null>(null);
  const reconnectTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const updateConnection = React.useCallback((updates: Partial<WebSocketConnection>) => {
    setConnection(prev => {
      const newConnection = { ...prev, ...updates };
      onConnectionChange?.(newConnection);
      return newConnection;
    });
  }, [onConnectionChange]);

  const handleMessage = React.useCallback((event: any) => {
    try {
      const update: RealTimeUpdate = JSON.parse(event.data);
      setLastUpdate(update);
      onUpdate?.(update);
      
      // Update last heartbeat
      updateConnection({ lastHeartbeat: new Date() });
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }, [onUpdate, updateConnection]);

  const handleOpen = React.useCallback(() => {
    updateConnection({
      isConnected: true,
      reconnectAttempts: 0,
      lastHeartbeat: new Date(),
    });
  }, [updateConnection]);

  const handleClose = React.useCallback(() => {
    setConnection(prev => {
      const newConnection = { ...prev, isConnected: false };
      onConnectionChange?.(newConnection);
      
      // Attempt to reconnect if we haven't exceeded max attempts
      if (prev.reconnectAttempts < maxReconnectAttempts) {
        reconnectTimeoutRef.current = setTimeout(() => {
          setConnection(current => {
            const updatedConnection = { ...current, reconnectAttempts: current.reconnectAttempts + 1 };
            onConnectionChange?.(updatedConnection);
            return updatedConnection;
          });
          // Call connect after state update using ref to avoid circular dependency
          setTimeout(() => connectRef.current?.(), 0);
        }, reconnectInterval);
      }
      
      return newConnection;
    });
  }, [maxReconnectAttempts, reconnectInterval, onConnectionChange]);

  const handleError = React.useCallback((error: any) => {
    updateConnection({ 
      error: error.message || 'WebSocket connection error',
      isConnected: false,
    });
  }, [updateConnection]);

  const connectRef = React.useRef<() => void>();

  const connect = React.useCallback(() => {
    if (wsRef.current?.isConnected) {
      return;
    }

    try {
      // In a real implementation, this would be a real WebSocket
      // const ws = new WebSocket(`ws://localhost:3000${endpoint}`);
      const ws = new MockWebSocket(`ws://localhost:3000${endpoint}`);
      
      ws.addEventListener('open', handleOpen);
      ws.addEventListener('message', handleMessage);
      ws.addEventListener('close', handleClose);
      ws.addEventListener('error', handleError);
      
      wsRef.current = ws;
    } catch (error) {
      handleError(error);
    }
  }, [endpoint, handleOpen, handleMessage, handleClose, handleError]);

  // Store connect function in ref to avoid circular dependency
  connectRef.current = connect;

  const disconnect = React.useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    updateConnection({ isConnected: false, reconnectAttempts: 0 });
  }, [updateConnection]);

  const reconnect = React.useCallback(() => {
    disconnect();
    updateConnection({ reconnectAttempts: 0 });
    connect();
  }, [disconnect, connect, updateConnection]);

  const sendMessage = React.useCallback((message: any) => {
    if (wsRef.current && connection.isConnected) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, [connection.isConnected]);

  // Initialize connection on mount
  React.useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, []); // Remove dependencies to prevent re-initialization

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    connection,
    lastUpdate,
    sendMessage,
    disconnect,
    reconnect,
  };
};