import type { ReactNode } from "react";

import { Footer } from "./footer";
import { Header } from "./header";
import { InfoCarousel } from "./info-carousel";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen">
      <InfoCarousel />
      <Header />
      {children}
      <Footer />
    </div>
  );
}
