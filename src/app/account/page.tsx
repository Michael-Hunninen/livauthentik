'use client';

// Import dynamic with a different name to avoid conflicts
import dynamicImport from 'next/dynamic';

// Dynamically import the client component with no SSR
const AccountClient = dynamicImport(
  () => import('./AccountClient'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    )
  }
);

export const dynamic = 'force-dynamic';

export default function AccountPage() {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : <AccountClient />}
    </div>
  );
}
