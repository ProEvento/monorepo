
import { Dispatch, useCallback, useEffect, useState } from 'react';

export default function useLocalStorage(
  key: string,
  initialValue: string = ''
): [string, Dispatch<string>] {
  const [value, setValue] = useState(
    () => typeof window !== 'undefined' ? window.localStorage.getItem(key) : initialValue
  );

  const setItem = (newValue: string) => {
    setValue(newValue);
    if (typeof window !== 'undefined'){
      window.localStorage.setItem(key, newValue);
    }
  };

  useEffect(() => {
    const newValue = ''
    if (typeof window !== 'undefined'){
      const newValue = window.localStorage.getItem(key);
    }
    if (value !== newValue) {
      setValue(newValue || initialValue);
    }
  });

  const handleStorage = useCallback(
    (event: StorageEvent) => {
      if (event.key === key && event.newValue !== value) {
        setValue(event.newValue || initialValue);
      }
    },
    [value]
  );

  useEffect(() => {
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [handleStorage]);

  return [value, setItem];
}