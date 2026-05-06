"use client";

import { Navbar } from "@/components/navbar";
import { ClerkProvider } from "@clerk/nextjs";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={{ variables: { colorPrimary: '#FF006E' }} }>
        <Navbar /> 
        {children}
    </ClerkProvider>
  )
}
