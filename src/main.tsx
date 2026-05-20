import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.tsx';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { persister } from './lib/persister';
import { CacheErrorBoundary } from './components/CacheErrorBoundary';
import { initGA } from './lib/ga';

initGA();

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24,
      }}
    >
      <CacheErrorBoundary>
        <RouterProvider router={router} />
      </CacheErrorBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster position="bottom-center" />
    </PersistQueryClientProvider>
  </StrictMode>,
);
