import React from 'react';
import { Toaster } from "@/components/ui/toaster";

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};