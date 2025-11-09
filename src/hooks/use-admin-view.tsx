import { useState, useEffect } from 'react';

const ADMIN_VIEW_KEY = 'rafagent_admin_view_enabled';

/**
 * Hook to manage admin view toggle state
 * Stores preference in localStorage so it persists across sessions
 * 
 * @returns {[boolean, (enabled: boolean) => void]} - [isAdminViewEnabled, setAdminViewEnabled]
 */
export function useAdminView() {
  const [isAdminViewEnabled, setIsAdminViewEnabled] = useState<boolean>(() => {
    // Initialize from localStorage, default to true (show admin view)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(ADMIN_VIEW_KEY);
      return stored !== null ? stored === 'true' : true;
    }
    return true;
  });

  useEffect(() => {
    // Save to localStorage whenever it changes
    localStorage.setItem(ADMIN_VIEW_KEY, String(isAdminViewEnabled));
  }, [isAdminViewEnabled]);

  return [isAdminViewEnabled, setIsAdminViewEnabled] as const;
}

