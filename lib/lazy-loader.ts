import dynamic from 'next/dynamic';

// Утилита для ленивой загрузки компонентов
export const lazyLoad = {
  // Компоненты с полной загрузкой
  component: (importFn: () => Promise<any>) => dynamic(importFn, {
    loading: () => null,
    ssr: false
  }),

  // Компоненты с прелоадером
  componentWithLoader: (
    importFn: () => Promise<any>, 
    LoadingComponent?: React.ComponentType
  ) => dynamic(importFn, {
    loading: LoadingComponent || (() => <div>Загрузка...</div>),
    ssr: false
  }),

  // Модули с отложенной загрузкой
  module: (importFn: () => Promise<any>) => {
    return async (...args: any[]) => {
      const module = await importFn();
      return module.default(...args);
    };
  }
};
