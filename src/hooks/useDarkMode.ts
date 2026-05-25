import { useState, useEffect } from 'react';
import { getDarkMode, setDarkMode } from '../utils';

export function useDarkMode() {
  const [dark, setDark] = useState<boolean>(getDarkMode);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    setDarkMode(dark);
  }, [dark]);

  const toggle = () => setDark((prev) => !prev);

  return { dark, toggle };
}
