// Core Data Types

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'analyst' | 'viewer';
  createdAt: Date;
  updatedAt: Date;
}

export interface Metric {
  id: string;
  name: string;
  value: number;
  unit?: string;
  change?: {
    value: number;
    percentage: number;
    period: string;
    type: 'increase' | 'decrease';
  };
  target?: number;
  category: 'sales' | 'customers' | 'revenue' | 'performance';
  updatedAt: Date;
}

export interface ChartDataPoint {
  x: string | number | Date;
  y: number;
  label?: string;
  color?: string;
}

export interface ChartData {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'doughnut';
  data: ChartDataPoint[];
  options?: ChartOptions;
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      display?: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
    tooltip?: {
      enabled?: boolean;
      mode?: 'index' | 'dataset' | 'point' | 'nearest';
    };
  };
  scales?: {
    x?: {
      display?: boolean;
      grid?: {
        display?: boolean;
      };
    };
    y?: {
      display?: boolean;
      grid?: {
        display?: boolean;
      };
    };
  };
}

// Component Props Types

export interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: boolean;
  header?: boolean;
  footer?: boolean;
}

export interface MetricCardProps {
  title: string;
  value: string | number | React.ReactNode;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  } | undefined;
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string | undefined;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export interface ChartProps {
  data: ChartData[];
  type: 'line' | 'bar' | 'pie' | 'area' | 'doughnut';
  height?: number;
  responsive?: boolean;
  animated?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pagination?: boolean;
  sorting?: boolean;
  filtering?: boolean;
  loading?: boolean;
  className?: string;
}

export interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

// Button Component Types

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'ghost' | 'outline' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

// Input Component Types

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

// Navigation Types

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: NavItem[];
  disabled?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

// API Types

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Authentication Types

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Dashboard Types

export interface DashboardData {
  metrics: Metric[];
  charts: ChartData[];
  recentActivity: Activity[];
  notifications: Notification[];
}

export interface Activity {
  id: string;
  type: 'sale' | 'customer' | 'report' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  user?: {
    name: string;
    avatar?: string;
  };
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// Sales Types

export interface SalesData {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  products: SalesProduct[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SalesProduct {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: Address;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate?: Date;
  createdAt: Date;
  status: 'active' | 'inactive';
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Theme Types

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  fontFamily: 'inter' | 'system';
}

// Loading and Error States

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated?: Date;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

// Utility Types

export type Status = 'idle' | 'loading' | 'success' | 'error';

export type SortDirection = 'asc' | 'desc';

export type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith';

export interface Filter {
  field: string;
  operator: FilterOperator;
  value: any;
}

export interface Sort {
  field: string;
  direction: SortDirection;
}

// Event Types

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: Date;
  userId?: string;
}

// Phase 3: Advanced Features Types

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface DateRangePreset {
  label: string;
  value: string;
  range: DateRange;
}

export interface FilterState {
  dateRange: DateRange;
  regions: string[];
  storeTypes: string[];
  salesReps: string[];
  searchQuery: string;
}

export interface ChartExportOptions {
  format: 'png' | 'pdf' | 'csv';
  filename?: string;
  quality?: number;
}

export interface ChartDrillDownData {
  level: number;
  parentId?: string;
  data: ChartDataPoint[];
  breadcrumb: string[];
}

export interface RealTimeUpdate {
  type: 'metric' | 'chart' | 'notification';
  id: string;
  data: any;
  timestamp: Date;
}

export interface WebSocketConnection {
  isConnected: boolean;
  lastHeartbeat?: Date;
  reconnectAttempts: number;
  error?: string;
}

export interface SocialMediaPost {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  content: string;
  imageUrl?: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
  };
  createdAt: Date;
  url: string;
}

export interface SocialMediaWidget {
  title: string;
  posts: SocialMediaPost[];
  totalEngagement: number;
  growthRate: number;
}

export interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
  category: 'navigation' | 'data' | 'view' | 'export';
}

export interface TooltipConfig {
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
  trigger: 'hover' | 'click' | 'focus';
  delay?: number;
}

export interface DashboardLayout {
  id: string;
  name: string;
  isDefault: boolean;
  widgets: WidgetConfig[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WidgetConfig {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'social';
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, any>;
}

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
  };
}

export interface AccessibilityConfig {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  keyboardNavigation: boolean;
}

export interface NotificationSettings {
  realTimeUpdates: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  categories: {
    sales: boolean;
    system: boolean;
    alerts: boolean;
    reports: boolean;
  };
}

// Export all types
// Note: React types are imported directly where needed