import { useState, useCallback } from 'react';

/**
 * Custom hook for managing a boolean toggle state.
 *
 * @param {boolean} [initialValue=false] - The initial value of the toggle.
 * @returns {[boolean, () => void, () => void, () => void]} - An array containing the toggle state, toggle function, enable function, and disable function.
 */
export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, () => void, () => void] {
  const [toggled, setToggled] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setToggled((prev) => !prev);
  }, []);

  const enable = useCallback(() => {
    setToggled(true);
  }, []);

  const disable = useCallback(() => {
    setToggled(false);
  }, []);

  return [toggled, toggle, enable, disable];
}