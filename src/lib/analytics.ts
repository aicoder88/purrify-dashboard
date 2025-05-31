/**
 * Analytics and SEO optimization utilities
 */

import React from 'react';

// Analytics event types
export interface AnalyticsEvent {
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// User properties for analytics
export interface UserProperties {
  user_id?: string;
  user_type?: 'admin' | 'user' | 'guest';
  subscription_tier?: string;
  company_size?: string;
  industry?: string;
  [key: string]: any;
}

/**
 * Analytics manager for tracking user interactions and performance
 */
export class AnalyticsManager {
  private static instance: AnalyticsManager;
  private isInitialized = false;
  private queue: AnalyticsEvent[] = [];
  private userProperties: UserProperties = {};

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  /**
   * Initialize analytics with configuration
   */
  initialize(config: {
    googleAnalyticsId?: string;
    mixpanelToken?: string;
    hotjarId?: string;
    enableInDevelopment?: boolean;
  }): void {
    if (this.isInitialized) return;

    const { googleAnalyticsId, mixpanelToken, hotjarId, enableInDevelopment = false } = config;

    // Skip initialization in development unless explicitly enabled
    if (process.env.NODE_ENV === 'development' && !enableInDevelopment) {
      console.log('Analytics disabled in development mode');
      return;
    }

    // Initialize Google Analytics 4
    if (googleAnalyticsId) {
      this.initializeGA4(googleAnalyticsId);
    }

    // Initialize Mixpanel
    if (mixpanelToken) {
      this.initializeMixpanel(mixpanelToken);
    }

    // Initialize Hotjar
    if (hotjarId) {
      this.initializeHotjar(hotjarId);
    }

    this.isInitialized = true;

    // Process queued events
    this.queue.forEach(event => this.track(event));
    this.queue = [];
  }

  /**
   * Track an analytics event
   */
  track(event: AnalyticsEvent): void {
    if (!this.isInitialized) {
      this.queue.push(event);
      return;
    }

    // Send to Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters,
      });
    }

    // Send to Mixpanel
    if (typeof mixpanel !== 'undefined') {
      mixpanel.track(event.name, {
        category: event.category,
        action: event.action,
        label: event.label,
        value: event.value,
        ...event.custom_parameters,
      });
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', event);
    }
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: UserProperties): void {
    this.userProperties = { ...this.userProperties, ...properties };

    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        user_id: properties.user_id,
        custom_map: properties,
      });
    }

    if (typeof mixpanel !== 'undefined') {
      mixpanel.people.set(properties);
    }
  }

  /**
   * Track page view
   */
  trackPageView(path: string, title?: string): void {
    this.track({
      name: 'page_view',
      category: 'navigation',
      action: 'page_view',
      label: path,
      custom_parameters: {
        page_path: path,
        page_title: title || document.title,
      },
    });
  }

  /**
   * Track user interaction
   */
  trackInteraction(element: string, action: string, details?: Record<string, any>): void {
    this.track({
      name: 'user_interaction',
      category: 'engagement',
      action,
      label: element,
      ...(details && { custom_parameters: details }),
    });
  }

  /**
   * Track business metrics
   */
  trackBusinessMetric(metric: string, value: number, details?: Record<string, any>): void {
    this.track({
      name: 'business_metric',
      category: 'business',
      action: metric,
      value,
      ...(details && { custom_parameters: details }),
    });
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metric: string, value: number, rating: 'good' | 'needs-improvement' | 'poor'): void {
    this.track({
      name: 'performance_metric',
      category: 'performance',
      action: metric,
      value,
      custom_parameters: {
        rating,
        timestamp: Date.now(),
      },
    });
  }

  /**
   * Track errors
   */
  trackError(error: Error, context?: Record<string, any>): void {
    this.track({
      name: 'error',
      category: 'error',
      action: 'javascript_error',
      label: error.message,
      custom_parameters: {
        error_stack: error.stack,
        error_name: error.name,
        ...context,
      },
    });
  }

  private initializeGA4(measurementId: string): void {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag = function() {
      (window as any).dataLayer.push(arguments);
    };

    gtag('js', new Date());
    gtag('config', measurementId, {
      send_page_view: false, // We'll handle page views manually
    });
  }

  private initializeMixpanel(token: string): void {
    // Load Mixpanel script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
    script.onload = () => {
      (window as any).mixpanel.init(token);
    };
    document.head.appendChild(script);
  }

  private initializeHotjar(siteId: string): void {
    // Load Hotjar script
    (window as any).hj = (window as any).hj || function() {
      ((window as any).hj.q = (window as any).hj.q || []).push(arguments);
    };
    (window as any)._hjSettings = { hjid: siteId, hjsv: 6 };

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://static.hotjar.com/c/hotjar-${siteId}.js?sv=6`;
    document.head.appendChild(script);
  }
}

/**
 * SEO optimization utilities
 */
export class SEOManager {
  /**
   * Update page metadata
   */
  static updateMetadata(metadata: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogUrl?: string;
    twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    canonicalUrl?: string;
    robots?: string;
  }): void {
    const {
      title,
      description,
      keywords,
      ogTitle,
      ogDescription,
      ogImage,
      ogUrl,
      twitterCard,
      twitterTitle,
      twitterDescription,
      twitterImage,
      canonicalUrl,
      robots,
    } = metadata;

    // Update title
    if (title) {
      document.title = title;
      this.updateMetaTag('property', 'og:title', ogTitle || title);
      this.updateMetaTag('name', 'twitter:title', twitterTitle || title);
    }

    // Update description
    if (description) {
      this.updateMetaTag('name', 'description', description);
      this.updateMetaTag('property', 'og:description', ogDescription || description);
      this.updateMetaTag('name', 'twitter:description', twitterDescription || description);
    }

    // Update keywords
    if (keywords && keywords.length > 0) {
      this.updateMetaTag('name', 'keywords', keywords.join(', '));
    }

    // Update Open Graph tags
    if (ogImage) {
      this.updateMetaTag('property', 'og:image', ogImage);
    }
    if (ogUrl) {
      this.updateMetaTag('property', 'og:url', ogUrl);
    }

    // Update Twitter Card tags
    if (twitterCard) {
      this.updateMetaTag('name', 'twitter:card', twitterCard);
    }
    if (twitterImage) {
      this.updateMetaTag('name', 'twitter:image', twitterImage);
    }

    // Update canonical URL
    if (canonicalUrl) {
      this.updateLinkTag('canonical', canonicalUrl);
    }

    // Update robots
    if (robots) {
      this.updateMetaTag('name', 'robots', robots);
    }
  }

  /**
   * Generate structured data for rich snippets
   */
  static addStructuredData(data: {
    type: 'Organization' | 'WebSite' | 'BreadcrumbList' | 'Article' | 'Product';
    properties: Record<string, any>;
  }): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': data.type,
      ...data.properties,
    });

    // Remove existing structured data of the same type
    const existing = document.querySelector(`script[type="application/ld+json"][data-type="${data.type}"]`);
    if (existing) {
      existing.remove();
    }

    script.setAttribute('data-type', data.type);
    document.head.appendChild(script);
  }

  /**
   * Add breadcrumb structured data
   */
  static addBreadcrumbs(breadcrumbs: Array<{ name: string; url: string }>): void {
    this.addStructuredData({
      type: 'BreadcrumbList',
      properties: {
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.url,
        })),
      },
    });
  }

  private static updateMetaTag(attribute: string, name: string, content: string): void {
    let tag = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attribute, name);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  }

  private static updateLinkTag(rel: string, href: string): void {
    let tag = document.querySelector(`link[rel="${rel}"]`);
    if (!tag) {
      tag = document.createElement('link');
      tag.setAttribute('rel', rel);
      document.head.appendChild(tag);
    }
    tag.setAttribute('href', href);
  }
}

/**
 * React hooks for analytics and SEO
 */

/**
 * Hook for tracking page views
 */
export function usePageTracking() {
  const analytics = React.useMemo(() => AnalyticsManager.getInstance(), []);

  React.useEffect(() => {
    analytics.trackPageView(window.location.pathname, document.title);
  }, [analytics]);

  return {
    trackPageView: analytics.trackPageView.bind(analytics),
    trackInteraction: analytics.trackInteraction.bind(analytics),
    trackBusinessMetric: analytics.trackBusinessMetric.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
  };
}

/**
 * Hook for SEO metadata management
 */
export function useSEO(metadata: Parameters<typeof SEOManager.updateMetadata>[0]) {
  React.useEffect(() => {
    SEOManager.updateMetadata(metadata);
  }, [metadata]);
}

// Global analytics instance
export const analytics = AnalyticsManager.getInstance();

// Declare global types
declare global {
  function gtag(...args: any[]): void;
  const mixpanel: any;
}

// Export commonly used tracking functions
export const trackEvent = (event: AnalyticsEvent) => analytics.track(event);
export const trackPageView = (path: string, title?: string) => analytics.trackPageView(path, title);
export const trackInteraction = (element: string, action: string, details?: Record<string, any>) => 
  analytics.trackInteraction(element, action, details);
export const trackError = (error: Error, context?: Record<string, any>) => 
  analytics.trackError(error, context);