import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

/**
 * Hook to detect if the user has requested reduced motion at the OS level.
 * @returns boolean - true if reduced motion is preferred
 */
export function useReducedMotion() {
  return useFramerReducedMotion();
}
