'use client'

import { useCallback, useEffect } from 'react'

export function useWarnOnUnload({ shouldWarn, message }: { shouldWarn: boolean, message: string }) {
  const handleBeforeUnload = useCallback((event: BeforeUnloadEvent) => {
    if (shouldWarn) {
      event.preventDefault();
      event.returnValue = message;
      return message;
    }
  }, [message, shouldWarn]);
  useEffect(() => {
    if (shouldWarn) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleBeforeUnload, shouldWarn]);
  return null;
}
