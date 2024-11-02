import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

const HeroSection: React.FC = () => {
  return (
    <div className="bg-white -mb-20">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 text-2xl font-bold">&#9776;</button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 focus:outline-none"
            />
            <FaSearch className="absolute top-2 right-4 text-gray-500" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <FaBell className="text-gray-500" />
          <FaUserCircle className="text-gray-500" />
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-purple-600 text-white p-8 h-52 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold">Projects</h1>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 bottom-28 relative">
        <div className="bg-white shadow-md rounded-lg p-6 text-center transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">New Request</h2>
          <p className="text-3xl font-bold text-gray-900">18</p>
          <p className="text-gray-500">2 Completed</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">Assigned Active</h2>
          <p className="text-3xl font-bold text-gray-900">132</p>
          <p className="text-gray-500">28 Completed</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">Completed</h2>
          <p className="text-3xl font-bold text-gray-900">12</p>
          <p className="text-gray-500">1 Completed</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">New Volunteers</h2>
          <p className="text-3xl font-bold text-gray-900">76%</p>
          <p className="text-green-500">5% Completed</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
