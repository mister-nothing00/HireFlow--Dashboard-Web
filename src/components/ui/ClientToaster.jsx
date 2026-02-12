'use client';

import { Toaster } from 'react-hot-toast';

export default function ClientToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: { borderRadius: "12px", fontFamily: "Inter, sans-serif" },
      }}
    />
  );
}