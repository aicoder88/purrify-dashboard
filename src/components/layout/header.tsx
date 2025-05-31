'use client';

import * as React from 'react';
import { Button } from '@/components/ui';
import { DarkModeToggle } from '@/components/ui/dark-mode-toggle';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  className?: string;
}

export function Header({ onMenuClick, showMenuButton = false, className }: HeaderProps) {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className={cn(
      "sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6",
      className
    )}>
      {/* Mobile Menu Button */}
      {showMenuButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="md:hidden"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <span className="sr-only">Open menu</span>
        </Button>
      )}

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-teal-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">P</span>
        </div>
        <span className="hidden sm:block font-semibold text-lg">
          Purrify Dashboard
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search Bar - Desktop */}
      <div className="hidden md:flex items-center gap-2 max-w-sm w-full">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="search"
            placeholder="Search..."
            className="input pl-10 h-9"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-5 5v-5zM10.5 3.5a6 6 0 0 1 6 6v2l1.5 3h-15l1.5-3v-2a6 6 0 0 1 6-6z"
            />
          </svg>
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-error text-xs"></span>
          <span className="sr-only">Notifications</span>
        </Button>

        {/* Dark Mode Toggle */}
        <DarkModeToggle size="sm" />

        {/* User Menu */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.role}</p>
          </div>
          
          <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
            <span className="text-teal-600 font-medium text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}