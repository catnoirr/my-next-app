// src/dashboard/page.jsx

import Sidebar from '../components/Sidebar';
import HeroSection from "../components/HeroSection";
import ActiveProjects from "../components/ActiveProjects";

export default function DashboardPage() {
  return (
    <div className="flex">
      {/* Make Sidebar fixed */}
      <div className="fixed h-screen w-64">
        <Sidebar />
      </div>

      {/* Add margin-left to main content to avoid overlap with fixed Sidebar */}
      <main className="flex-1 ml-64 p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <HeroSection />
        <ActiveProjects />
      </main>
    </div>
  );
}
