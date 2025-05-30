'use client';

import dynamic from 'next/dynamic';

// Dynamically import the client component with SSR disabled
const AccountClient = dynamic(
  () => import('./AccountClient'),
  { 
    ssr: false,
    loading: () => <div>Loading...</div>
  }
);

export const dynamic = 'force-dynamic';

export default function AccountPage() {
  return <AccountClient />;
}
