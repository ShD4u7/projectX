import React, { Suspense, lazy } from 'react';
import dynamic from 'next/dynamic';

// Компонент прелоадера
export const Preloader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
  </div>
);

// Утилита для ленивой загрузки компонентов
export const ProgressiveLoader = {
  // Компонент с полной ленивой загрузкой
  component: (
    importFn: () => Promise<{ default: React.ComponentType<any> }>, 
    fallback: React.ReactNode = <Preloader />
  ) => dynamic(importFn, {
    loading: () => fallback,
    ssr: false
  }),

  // Компонент с серверным рендерингом
  serverComponent: (
    importFn: () => Promise<{ default: React.ComponentType<any> }>, 
    fallback: React.ReactNode = <Preloader />
  ) => {
    const DynamicComponent = lazy(importFn);
    
    return (props: any) => (
      <Suspense fallback={fallback}>
        <DynamicComponent {...props} />
      </Suspense>
    );
  },

  // Обертка для секционной загрузки
  section: (
    importFn: () => Promise<{ default: React.ComponentType<any> }>, 
    options: {
      ssr?: boolean;
      fallback?: React.ReactNode;
    } = {}
  ) => {
    const { 
      ssr = true, 
      fallback = <Preloader /> 
    } = options;

    return dynamic(importFn, {
      loading: () => fallback,
      ssr
    });
  }
};

// Хук для предварительной загрузки
export function usePreloadComponent(
  importFn: () => Promise<{ default: React.ComponentType<any> }>
) {
  React.useEffect(() => {
    const preload = async () => {
      await importFn();
    };
    preload();
  }, [importFn]);
}
