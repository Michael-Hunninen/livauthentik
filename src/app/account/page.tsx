'use client';

import { useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';

// Define a simple loading component
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
    </div>
  );
}

// Disable SSR for the entire page
export const dynamic = 'force-dynamic';

// Dynamically import the AccountClient component with no SSR
const AccountClient = dynamicImport(
  () => import('./AccountClient'),
  { 
    ssr: false,
    loading: () => <LoadingSpinner />
  }
);

export default function AccountPage() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show loading state until we're on the client
  if (!isMounted) {
    return <LoadingSpinner />;
  }

  return <AccountClient />;
}
