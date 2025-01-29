// Утилиты для оптимизации производительности

// Декоратор мемоизации
export function memoize(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const cache = new Map();

  descriptor.value = function(...args: any[]) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    
    return result;
  };

  return descriptor;
}

// Функция throttle для ограничения частоты вызовов
export function throttle(func: Function, limit: number) {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Функция debounce для отложенного выполнения
export function debounce(func: Function, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return function(this: any, ...args: any[]) {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(context, args), delay);
  };
}

// Профилировщик производительности
export class PerformanceTracker {
  private static marks: Map<string, number> = new Map();

  static start(label: string) {
    this.marks.set(label, performance.now());
  }

  static end(label: string) {
    const start = this.marks.get(label);
    if (start) {
      const duration = performance.now() - start;
      console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
      this.marks.delete(label);
    }
  }

  // Измерение производительности функции
  static measure(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
      const start = performance.now();
      const result = originalMethod.apply(this, args);
      const duration = performance.now() - start;

      console.log(`[Performance] ${propertyKey}: ${duration.toFixed(2)}ms`);
      return result;
    };

    return descriptor;
  }
}
