import { useState, useCallback } from 'react';

interface UseLoadingReturn {
  isLoading: boolean;
  loadingMessage: string;
  loadingGifUrl?: string;
  startLoading: (message?: string, gifUrl?: string) => void;
  stopLoading: () => void;
  setLoadingMessage: (message: string) => void;
  setLoadingGifUrl: (gifUrl?: string) => void;
}

export const useLoading = (): UseLoadingReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [loadingGifUrl, setLoadingGifUrl] = useState<string | undefined>();

  const startLoading = useCallback((message: string = 'Loading...', gifUrl?: string) => {
    setLoadingMessage(message);
    setLoadingGifUrl(gifUrl);
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    loadingMessage,
    loadingGifUrl,
    startLoading,
    stopLoading,
    setLoadingMessage,
    setLoadingGifUrl,
  };
};
