// src/dashboard/page.jsx
"use client";

import Sidebar from '../components/Sidebar';
import HeroSection from "../components/HeroSection";
import ActiveProjects from "../components/ActiveProjects";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full ">
      {/* Sidebar as Topbar on mobile, sidebar on the left for desktop */}
      <div className="md:hidden fixed top-0 left-0 right-0 shadow-md z-10 rounded-b-3xl">
        <Sidebar />
      </div>
      
      {/* Sidebar on the left for desktop */}
      <div className="hidden md:block fixed w-64 bg-white shadow-lg rounded-3xl md:mt-6 md:ml-2">
        <Sidebar />
      </div>

      {/* Main content with margin on larger screens to avoid overlap */}
      <main className="flex-1 md:ml-72 p-4 pt-20 md:pt-4 md:mt-6 mt-5 "> {/* Adjust padding-top for mobile */}
        <div className="flex items-center space-x-4 justify-between md:gap-96 ">
          <h1 className="text-2xl font-bold flex-1">Dashboard</h1>
 
          
        </div>
        <HeroSection />
        <ActiveProjects />
      </main>
    </div>
  );
}
