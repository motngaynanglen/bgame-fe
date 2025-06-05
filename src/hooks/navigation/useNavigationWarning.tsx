'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

interface UseNavigationWarningProps {
  shouldWarn: boolean;
  message: string;
}

interface UseNavigationWarningReturn {
  confirmAndNavigate: (url: string) => void;
  showModal: boolean;
  handleConfirmNavigation: () => void;
  handleCancelNavigation: () => void;
}

export function useNavigationWarning({ shouldWarn, message }: UseNavigationWarningProps): UseNavigationWarningReturn {
  const router = useRouter();
  const pathname = usePathname();

  const [showModal, setShowModal] = useState<boolean>(false); // Kiểu dữ liệu cho state
  const [nextUrl, setNextUrl] = useState<string>(''); // Kiểu dữ liệu cho state

  // 1. Xử lý sự kiện beforeunload (khi rời khỏi trang hoàn toàn)
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
    } else {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleBeforeUnload, shouldWarn]);

  // 2. Hàm để kiểm soát điều hướng nội bộ
  const confirmAndNavigate = useCallback((url: string) => {
  if (shouldWarn && url !== pathname) {
    setNextUrl(url);
    setShowModal(true);
  } else {
    router.push(url);
  }
}, [shouldWarn, pathname, router]);  // Bỏ message khỏi đây


  const handleConfirmNavigation = useCallback(() => {
    setShowModal(false);
    router.push(nextUrl);
  }, [nextUrl, router]);

  const handleCancelNavigation = useCallback(() => {
    setShowModal(false);
    setNextUrl('');
  }, []);

  return {
    confirmAndNavigate,
    showModal,
    handleConfirmNavigation,
    handleCancelNavigation
  };
}