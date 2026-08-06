import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.tsx';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { persister } from './lib/persister';
import { CacheErrorBoundary } from './components/CacheErrorBoundary';
import { initGA } from './lib/ga';

import { useToastCenterStore } from './stores/toastCenterStore';
import useMediaQuery from './hooks/useMediaQuery';

import IcCircleCheckFill from './assets/icons/normal/ic_circleCheck_fill.svg?react';
import IcCircleExclamationFill from './assets/icons/normal/ic_circleExclamation_fill.svg?react';

initGA();

const queryClient = new QueryClient();

const AppToaster = () => {
  const centerX = useToastCenterStore((state) => state.centerX);
  const isMobileWidth = useMediaQuery('(max-width: 768px)');

  return (
    <Toaster
      position="top-center"
      icons={{
        success: (
          <IcCircleCheckFill className="h-[2.31rem] w-[2.31rem] [&_path]:fill-blue-80" />
        ),
        error: (
          <IcCircleExclamationFill className="h-[2.31rem] w-[2.31rem] [&_path]:fill-[#FE991D]" />
        ),
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'flex w-[65.2rem] max-sm:w-[48.8rem] items-center justify-center gap-[1rem] rounded-[1.5rem] bg-black-80 px-[3.15rem] py-[2.2rem] text-[2.2rem] font-[600] text-black-5',
          icon: 'm-0 flex items-center justify-center',
        },
      }}
      style={
        {
          '--width': isMobileWidth ? '48.8rem' : '65.2rem',
          ...(centerX !== null
            ? { left: `${centerX}px`, transform: 'translateX(-50%)' }
            : {}),
        } as React.CSSProperties
      }
    />
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24,
      }}
    >
      <HelmetProvider>
        <CacheErrorBoundary>
          <RouterProvider router={router} />
        </CacheErrorBoundary>
      </HelmetProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      <AppToaster />
    </PersistQueryClientProvider>
  </StrictMode>,
);
