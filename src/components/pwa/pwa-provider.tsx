'use client';

import * as React from 'react';
import { PWAInstallBanner } from './pwa-install-banner';
import { PWAUpdateBanner } from './pwa-update-banner';
import { OfflineIndicator } from './offline-indicator';
import { PushNotificationManager, useNotificationPrompt } from './push-notification-manager';

export const PWAProvider: React.FC = () => {
  const { showPrompt, dismissPrompt } = useNotificationPrompt();

  return (
    <>
      <OfflineIndicator />
      <PWAUpdateBanner />
      <PWAInstallBanner />
      <PushNotificationManager 
        showPrompt={showPrompt} 
        onDismiss={dismissPrompt} 
      />
    </>
  );
};

export default PWAProvider;