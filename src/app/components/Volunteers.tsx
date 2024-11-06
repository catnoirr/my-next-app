"use client";
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { FaCheck, FaTrash, FaEye, FaUser, FaThLarge, FaBars } from 'react-icons/fa';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  verified?: boolean;
}

interface VolunteersProps {
  searchTerm: string;
  filter: string;
}

const Volunteers: React.FC<VolunteersProps> = ({ searchTerm, filter }) => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isGridView, setIsGridView] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [volunteerToDelete, setVolunteerToDelete] = useState<string | null>(null);
  const volunteersPerPage = 9;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'volunteers'),
      (snapshot) => {
        const volunteerData = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
          id: doc.id,
          ...doc.data(),
        })) as Volunteer[];

        setVolunteers(volunteerData);
      },
      (error) => {
        console.error('Error fetching volunteers:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleVerify = async (volunteerId: string) => {
    const volunteerRef = doc(db, 'volunteers', volunteerId);
    await updateDoc(volunteerRef, { verified: true });
  };

  const confirmDelete = (volunteerId: string) => {
    setVolunteerToDelete(volunteerId);
  };

  const handleDelete = async () => {
    if (volunteerToDelete) {
      const volunteerRef = doc(db, 'volunteers', volunteerToDelete);
      await deleteDoc(volunteerRef);
      setVolunteerToDelete(null); // Reset after deletion
    }
  };

  const filteredVolunteers = volunteers
    .filter(volunteer => 
      (filter === 'All' || (filter === 'Verified' && volunteer.verified) || (filter === 'Unverified' && !volunteer.verified)) &&
      (volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const indexOfLastVolunteer = currentPage * volunteersPerPage;
  const indexOfFirstVolunteer = indexOfLastVolunteer - volunteersPerPage;
  const currentVolunteers = filteredVolunteers.slice(indexOfFirstVolunteer, indexOfLastVolunteer);
  const totalPages = Math.ceil(filteredVolunteers.length / volunteersPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-6 bg-gray-100 mt-6 rounded-2xl">
      {/* Toggle View Icons */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Volunteers</h2>
        <div className="flex space-x-3">
          <button 
            className={`p-3 rounded-lg ${isGridView ? 'bg-blue-600 text-white' : 'bg-gray-300'}`} 
            onClick={() => setIsGridView(true)}
            aria-label="Grid view"
          >
            <FaThLarge />
          </button>
          <button 
            className={`p-3 rounded-lg ${!isGridView ? 'bg-blue-600 text-white' : 'bg-gray-300'}`} 
            onClick={() => setIsGridView(false)}
            aria-label="List view"
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Volunteer Display */}
      <div className={isGridView ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "space-y-6"}>
        {currentVolunteers.map((volunteer) => (
          <div 
            key={volunteer.id} 
            className={`bg-white shadow-md rounded-lg p-5 border ${isGridView ? 'flex flex-col items-start' : 'flex sm:justify-between items-center'} relative transition-transform hover:scale-105`}
          >
            <div className="flex items-center space-x-3">
              <FaUser className="text-gray-500" size={24} />
              <div>
                <h3 className="text-xl font-medium text-gray-700">{volunteer.name}</h3>
                <p className="text-gray-500 text-sm">{volunteer.email}</p>
                {isGridView && (
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${volunteer.verified ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                    {volunteer.verified ? "Verified" : "Unverified"}
                  </span>
                )}
              </div>
            </div>

            {/* Status Badge and Action Icons */}
            <div className={`${isGridView ? 'mt-4' : 'flex items-center space-x-4'}`}>
              {!isGridView && (
                <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${volunteer.verified ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                  {volunteer.verified ? "Verified" : "Unverified"}
                </span>
              )}

              <div className={`${isGridView ? "absolute top-4 right-4" : "ml-auto flex space-x-4"} flex items-center space-x-3`}>
                <button
                  onClick={() => alert(`Document ID: ${volunteer.id}`)}
                  aria-label="View Document ID"
                  className="text-blue-500 hover:text-blue-700 transition"
                >
                  <FaEye />
                </button>
                {!volunteer.verified && (
                  <button
                    onClick={() => handleVerify(volunteer.id)}
                    aria-label="Verify Volunteer"
                    className="text-green-500 hover:text-green-700 transition"
                  >
                    <FaCheck />
                  </button>
                )}
                <button
                  onClick={() => confirmDelete(volunteer.id)}
                  aria-label="Remove Volunteer"
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 rounded-lg font-medium ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-200'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {filteredVolunteers.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No volunteers found matching your criteria.</p>
      )}

      {/* Delete Confirmation Modal */}
      {volunteerToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-80 text-center">
            <p className="text-lg font-semibold mb-4">Are you sure you want to delete this volunteer?</p>
            <div className="flex justify-between">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setVolunteerToDelete(null)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Volunteers;
