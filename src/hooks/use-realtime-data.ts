'use client';

import * as React from 'react';
import { RealTimeUpdate, WebSocketConnection } from '@/types';

interface UseRealTimeDataOptions {
  endpoint?: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onUpdate?: (update: RealTimeUpdate) => void;
  onConnectionChange?: (connection: WebSocketConnection) => void;
  /** Force mock mode even if WebSocket URL is set */
  forceMock?: boolean;
}

interface UseRealTimeDataReturn {
  connection: WebSocketConnection;
  lastUpdate: RealTimeUpdate | null;
  sendMessage: (message: Record<string, unknown>) => void;
  disconnect: () => void;
  reconnect: () => void;
  /** Whether using real WebSocket or mock */
  isMock: boolean;
}

// Event callback type
type EventCallback = (...args: unknown[]) => void;

// WebSocket message event type
interface WebSocketMessageEvent {
  data: string;
}

// WebSocket error event type
interface WebSocketErrorEvent {
  message?: string;
}

// Common interface for both real and mock WebSocket
interface WebSocketLike {
  addEventListener(event: string, callback: EventCallback): void;
  removeEventListener(event: string, callback: EventCallback): void;
  send(data: string): void;
  close(): void;
  readonly isConnected: boolean;
}

// Real WebSocket wrapper that implements our interface
class RealWebSocketWrapper implements WebSocketLike {
  private ws: WebSocket;
  private _isConnected = false;

  constructor(url: string) {
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this._isConnected = true;
    };

    this.ws.onclose = () => {
      this._isConnected = false;
    };
  }

  get isConnected(): boolean {
    return this._isConnected && this.ws.readyState === WebSocket.OPEN;
  }

  addEventListener(event: string, callback: EventCallback): void {
    this.ws.addEventListener(event, callback as EventListener);
  }

  removeEventListener(event: string, callback: EventCallback): void {
    this.ws.removeEventListener(event, callback as EventListener);
  }

  send(data: string): void {
    if (this.isConnected) {
      this.ws.send(data);
    }
  }

  close(): void {
    this.ws.close();
    this._isConnected = false;
  }
}

// Simulated WebSocket for demo/development purposes
class MockWebSocket implements WebSocketLike {
  private listeners: { [key: string]: EventCallback[] } = {};
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

  addEventListener(event: string, callback: EventCallback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  removeEventListener(event: string, callback: EventCallback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
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

  private emit(event: string, data: unknown) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
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

// Get WebSocket URL from environment
const getWebSocketUrl = (endpoint: string): string | null => {
  // Check for configured WebSocket URL
  const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
  if (wsUrl) {
    // If full URL provided, use it; otherwise append endpoint
    return wsUrl.endsWith('/') ? `${wsUrl}${endpoint.slice(1)}` : `${wsUrl}${endpoint}`;
  }
  return null;
};

// Factory function to create appropriate WebSocket
const createWebSocket = (endpoint: string, forceMock: boolean): { ws: WebSocketLike; isMock: boolean } => {
  const wsUrl = getWebSocketUrl(endpoint);

  // Use real WebSocket if URL is configured and not forcing mock
  if (wsUrl && !forceMock && typeof window !== 'undefined') {
    try {
      return { ws: new RealWebSocketWrapper(wsUrl), isMock: false };
    } catch (error) {
      console.warn('Failed to create real WebSocket, falling back to mock:', error);
    }
  }

  // Fall back to mock WebSocket
  return { ws: new MockWebSocket(`ws://localhost:3000${endpoint}`), isMock: true };
};

export const useRealTimeData = (
  options: UseRealTimeDataOptions = {}
): UseRealTimeDataReturn => {
  const {
    endpoint = '/api/realtime',
    reconnectInterval = 5000,
    maxReconnectAttempts = 5,
    onUpdate,
    onConnectionChange,
    forceMock = false,
  } = options;

  const [isMock, setIsMock] = React.useState(true);

  const [connection, setConnection] = React.useState<WebSocketConnection>({
    isConnected: false,
    reconnectAttempts: 0,
  });

  const [lastUpdate, setLastUpdate] = React.useState<RealTimeUpdate | null>(null);
  const wsRef = React.useRef<WebSocketLike | null>(null);
  const reconnectTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const updateConnection = React.useCallback(
    (updates: Partial<WebSocketConnection>) => {
      setConnection((prev) => {
        const newConnection = { ...prev, ...updates };
        onConnectionChange?.(newConnection);
        return newConnection;
      });
    },
    [onConnectionChange]
  );

  const handleMessage = React.useCallback(
    (event: unknown) => {
      try {
        const messageEvent = event as WebSocketMessageEvent;
        const update: RealTimeUpdate = JSON.parse(messageEvent.data);
        setLastUpdate(update);
        onUpdate?.(update);

        // Update last heartbeat
        updateConnection({ lastHeartbeat: new Date() });
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    },
    [onUpdate, updateConnection]
  );

  const handleOpen = React.useCallback(() => {
    updateConnection({
      isConnected: true,
      reconnectAttempts: 0,
      lastHeartbeat: new Date(),
    });
  }, [updateConnection]);

  const handleClose = React.useCallback(() => {
    setConnection((prev) => {
      const newConnection = { ...prev, isConnected: false };
      onConnectionChange?.(newConnection);

      // Attempt to reconnect if we haven't exceeded max attempts
      if (prev.reconnectAttempts < maxReconnectAttempts) {
        reconnectTimeoutRef.current = setTimeout(() => {
          setConnection((current) => {
            const updatedConnection = {
              ...current,
              reconnectAttempts: current.reconnectAttempts + 1,
            };
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

  const handleError = React.useCallback(
    (error: unknown) => {
      const errorEvent = error as WebSocketErrorEvent;
      updateConnection({
        error: errorEvent.message || 'WebSocket connection error',
        isConnected: false,
      });
    },
    [updateConnection]
  );

  const connectRef = React.useRef<() => void>();

  const connect = React.useCallback(() => {
    if (wsRef.current?.isConnected) {
      return;
    }

    try {
      // Use factory to create appropriate WebSocket (real or mock)
      const { ws, isMock: isUsingMock } = createWebSocket(endpoint, forceMock);
      setIsMock(isUsingMock);

      ws.addEventListener('open', handleOpen);
      ws.addEventListener('message', handleMessage);
      ws.addEventListener('close', handleClose);
      ws.addEventListener('error', handleError);

      wsRef.current = ws;

      if (!isUsingMock) {
        console.log('Connected to real WebSocket server');
      }
    } catch (error) {
      handleError(error);
    }
  }, [endpoint, forceMock, handleOpen, handleMessage, handleClose, handleError]);

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

  const sendMessage = React.useCallback(
    (message: Record<string, unknown>) => {
      if (wsRef.current && connection.isConnected) {
        wsRef.current.send(JSON.stringify(message));
      }
    },
    [connection.isConnected]
  );

  // Initialize connection on mount
  React.useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    isMock,
  };
};
