'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import * as React from 'react';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    children,
    React.createElement(ReactQueryDevtools, { initialIsOpen: false })
  );
}

export { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';