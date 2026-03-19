import { useEffect } from 'react';

export function ThemeController() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return null;
}
