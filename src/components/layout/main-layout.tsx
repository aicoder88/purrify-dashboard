'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { MobileNav } from './mobile-nav';
import { EnhancedMobileNav } from './enhanced-mobile-nav';
import { PWAStatusIndicator } from '@/components/pwa/pwa-status-indicator';
import { PullToRefresh } from '@/components/mobile/pull-to-refresh';
import type { DashboardLayoutProps } from '@/types';

export function MainLayout({
  children,
  sidebar = true,
  header = true,
  footer = false
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleRefresh = async () => {
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Mobile Navigation */}
      {isMobile && (
        <EnhancedMobileNav
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        {sidebar && !isMobile && (
          <div className="hidden md:flex md:w-64 md:flex-col">
            <Sidebar />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header with PWA Status */}
          {header && (
            <div className="relative">
              <Header
                onMenuClick={() => setSidebarOpen(true)}
                showMenuButton={isMobile}
              />
              {/* PWA Status Indicator */}
              <div className="absolute top-4 right-20 md:right-6">
                <PWAStatusIndicator compact className="text-xs" />
              </div>
            </div>
          )}

          {/* Main Content with Pull-to-Refresh on Mobile */}
          <main className="flex-1 overflow-y-auto">
            {isMobile ? (
              <PullToRefresh onRefresh={handleRefresh} className="h-full">
                <div className="container-padding section-spacing min-h-full">
                  {children}
                </div>
              </PullToRefresh>
            ) : (
              <div className="container-padding section-spacing">
                {children}
              </div>
            )}
          </main>

          {/* Footer */}
          {footer && (
            <footer className="border-t bg-card px-6 py-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <p>&copy; 2024 Purrify.ca. All rights reserved.</p>
                  {isMobile && <PWAStatusIndicator showLabels className="text-xs" />}
                </div>
                <p className="hidden sm:block">Built with Next.js & Tailwind CSS</p>
              </div>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}