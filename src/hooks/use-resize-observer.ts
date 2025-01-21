import { useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';

export const useResizeObserver = (callback: (entry: ResizeObserverEntry) => void) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const debouncedCallback = debounce((entries: ResizeObserverEntry[]) => {
      if (entries[0]) {
        callback(entries[0]);
      }
    }, 100);

    observerRef.current = new ResizeObserver(debouncedCallback);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback]);

  const setElement = (element: HTMLElement | null) => {
    if (element && element !== elementRef.current) {
      elementRef.current = element;
      if (observerRef.current) {
        observerRef.current.observe(element);
      }
    } else if (!element && elementRef.current && observerRef.current) {
      observerRef.current.unobserve(elementRef.current);
      elementRef.current = null;
    }
  };

  return setElement;
};