"use client";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, QueryDocumentSnapshot, doc, updateDoc } from "firebase/firestore";
import { FaEye, FaComments, FaThList, FaTh, FaChevronLeft, FaChevronRight ,FaHandPaper } from "react-icons/fa";
import { db } from "../firebaseConfig";
import CustomModal from "./CustomModal";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  details: string;
  status?: string;
  assignedVolunteers?: string[];
}

interface Volunteer {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  location?: string;
  requestedUsers?: string[];
}

interface PatientsProps {
  searchTerm: string;
  filter: string;
}

const Patients: React.FC<PatientsProps> = ({ searchTerm, filter}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isGridView, setIsGridView] = useState(true);
  const patientsPerPage = 8;

  useEffect(() => {
    const unsubscribePatients = onSnapshot(
      collection(db, "requests"),
      (snapshot) => {
        const patientData = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
          id: doc.id,
          ...doc.data(),
        })) as Patient[];
        setPatients(patientData);
      },
      (error) => {
        console.error("Error fetching patients:", error);
      }
    );

    const unsubscribeVolunteers = onSnapshot(
      collection(db, "volunteers"),
      (snapshot) => {
        const volunteerData = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
          id: doc.id,
          ...doc.data(),
        })) as Volunteer[];
        setVolunteers(volunteerData.filter(volunteer => volunteer.verified));
      },
      (error) => {
        console.error("Error fetching volunteers:", error);
      }
    );

    return () => {
      unsubscribePatients();
      unsubscribeVolunteers();
    };
  }, []);

  const openPatientModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsPatientModalOpen(true);
  };

  const closePatientModal = () => {
    setIsPatientModalOpen(false);
    setSelectedPatient(null);
  };

  const openVolunteerModal = () => {
    setIsVolunteerModalOpen(true);
  };

  const closeVolunteerModal = () => {
    setIsVolunteerModalOpen(false);
  };

  const assignVolunteerToPatient = async (volunteer: Volunteer) => {
    if (selectedPatient) {
      try {
        const patientRef = doc(db, "requests", selectedPatient.id);
        const updatedStatus = "Assigned";
        const updatedVolunteers = [...(selectedPatient.assignedVolunteers || []), volunteer.id];

        // Update patient status and assigned volunteers
        await updateDoc(patientRef, {
          status: updatedStatus,
          assignedVolunteers: updatedVolunteers,
        });

        // Update the volunteer's requestedUsers field
        const volunteerRef = doc(db, "volunteers", volunteer.id);
        await updateDoc(volunteerRef, {
          requestedUsers: [...(volunteer.requestedUsers || []), selectedPatient.id],
        });

        setPatients((prevPatients) =>
          prevPatients.map((p) =>
            p.id === selectedPatient.id ? { ...p, status: updatedStatus, assignedVolunteers: updatedVolunteers } : p
          )
        );
        closeVolunteerModal();
        closePatientModal();
      } catch (error) {
        console.error("Failed to assign volunteer:", error);
      }
    }
  };

  const filteredPatients = patients
    .filter(patient => filter === "All" || patient.status === filter)
    .filter(patient => patient.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className=" flex flex-col items-center mt-6 rounded-2xl">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl p-6 border">
      <div className="flex justify-between items-center mb-6">
  <h2 className="text-2xl font-semibold text-gray-700">Users Request</h2>

  {/* Only show the List/Grid toggle if there are patients */}
  {filteredPatients.length > 0 && (
    <button
      onClick={() => setIsGridView(!isGridView)}
      className="text-gray-600 hover:text-gray-800 sm:flex items-center hidden"
    >
      {isGridView ? <FaThList /> : <FaTh />}
      <span className="ml-2 text-sm">{isGridView ? "List View" : "Grid View"}</span>
    </button>
  )}
</div>


        {/* Patient cards or table view */}
        <div className="overflow-auto">
  {isGridView ? (
    filteredPatients.length === 0 ? (
      <div className="flex flex-col items-center justify-center mt-10 text-gray-500">
        <FaHandPaper size={50} className="mb-4" />
        <p className="text-lg font-semibold">No new requests</p>
      </div>
    ) : (
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 pt-0">
        {currentPatients.map((patient, index) => (
          <div
            key={`${patient.id}-${index}`}
            className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition duration-200 border"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{patient.name}</h3>
            <p className="text-sm text-gray-600">Email: {patient.email}</p>
            <p className="text-sm text-gray-600">Phone: {patient.phone}</p>
            {patient.status && (
              <span
                className={`inline-block mt-3 text-xs font-medium px-3 py-1 rounded-full ${
                  patient.status === "Assigned"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {patient.status}
              </span>
            )}
            <div className="flex justify-end mt-4 space-x-3">
              <button onClick={() => openPatientModal(patient)} title="View Details">
                <FaEye className="text-gray-500 hover:text-gray-700" />
              </button>
              <button title="Send Message">
                <FaComments className="text-blue-500 hover:text-blue-700" />
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  ) : (
            <table className="min-w-full bg-white rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 text-left text-sm font-semibold text-gray-600 border-b">Name</th>
                  <th className="py-2 text-left text-sm font-semibold text-gray-600 border-b">Email</th>
                  <th className="py-2 text-left text-sm font-semibold text-gray-600 border-b">Phone</th>
                  <th className="py-2 text-left text-sm font-semibold text-gray-600 border-b">Status</th>
                  <th className="py-2 text-left text-sm font-semibold text-gray-600 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPatients.map((patient, index) => (
                  <tr key={`${patient.id}-${index}`} className="hover:bg-gray-100 transition duration-200">
                    <td className="py-2 px-4 border-b">{patient.name}</td>
                    <td className="py-2 px-4 border-b">{patient.email}</td>
                    <td className="py-2 px-4 border-b">{patient.phone}</td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${
                          patient.status === "Assigned"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex space-x-2">
                        <button onClick={() => openPatientModal(patient)} title="View Details">
                          <FaEye className="text-gray-500 hover:text-gray-700" />
                        </button>
                        <button title="Send Message">
                          <FaComments className="text-blue-500 hover:text-blue-700" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
  {totalPages > 1 && (
    <>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-gray-500 hover:text-gray-700"
      >
        <FaChevronLeft />
      </button>
      <div>
        Page {currentPage} of {totalPages}
      </div>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-gray-500 hover:text-gray-700"
      >
        <FaChevronRight />
      </button>
    </>
  )}
</div>

      </div>

      {/* Patient Modal */}
     {/* Patient Modal */}
{selectedPatient && (
  <CustomModal isOpen={isPatientModalOpen} onClose={closePatientModal} title="Patient Details">
    <p><strong>Name:</strong> {selectedPatient.name}</p>
    
    <p><strong>Request:</strong> {selectedPatient.details}</p>
    <div className="mt-4">
      {selectedPatient.status === "Pending" ? (
        <button onClick={openVolunteerModal} className="bg-blue-500 text-white px-4 py-2 rounded">
          Assign Volunteers
        </button>
      ) : (
        <button onClick={openVolunteerModal} className="bg-blue-500 text-white px-4 py-2 rounded">
          View Volunteers
        </button>
      )}
    </div>
  </CustomModal>
)}


      {/* Volunteer Modal */}
      {isVolunteerModalOpen && (
  <CustomModal
    isOpen={isVolunteerModalOpen}
    onClose={closeVolunteerModal}
    title={selectedPatient?.status === "Pending" ? "Assign Volunteers" : "Assigned Volunteers"}
  >
    <ul className="space-y-3">
      {(selectedPatient?.status === "Pending"
        ? volunteers
        : volunteers.filter(v => selectedPatient?.assignedVolunteers?.includes(v.id))
      ).map((volunteer) => (
        <li key={volunteer.id} className="flex flex-col border p-2 rounded">
          <span><strong>Name:</strong> {volunteer.name}</span>
          <span><strong>Email:</strong> {volunteer.email}</span>
          <span><strong>Location:</strong> {volunteer.location || "N/A"}</span>
          {selectedPatient?.status === "Pending" && (
            <button
              onClick={() => assignVolunteerToPatient(volunteer)}
              className="bg-green-500 text-white px-2 rounded mt-2 self-start"
            >
              Assign
            </button>
          )}
        </li>
      ))}
    </ul>
  </CustomModal>
)}
    </div>
  );
};

export default Patients;
