"use client";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right section: Topbar + Main content */}
      <div className="flex flex-col flex-1">
        {/* Top navigation bar */}
        <Topbar title="Dashboard" />

        {/* Main content area with a lighter gray background */}
        <main className="flex-1 bg-gray-50 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
