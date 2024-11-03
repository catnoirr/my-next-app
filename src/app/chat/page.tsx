import React from 'react';
import Chat from '../components/Chat'; // Adjust the import path as necessary
import Sidebar from '../components/Sidebar'; // If you also want to include the sidebar here

const Page: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Optional Sidebar if you want it on this page */}
      {/* <Sidebar /> */}

      {/* Render the Chat Component */}
      <Chat />
    </div>
  );
};

export default Page;
