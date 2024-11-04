"use client";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, QueryDocumentSnapshot, doc, updateDoc } from "firebase/firestore";
import { FaEye, FaComments, FaThList, FaTh, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { db } from "../firebaseConfig";
import CustomModal from "./CustomModal";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  details: string;
  status?: string;
  assignedVolunteers?: string[]; // Add assignedVolunteers field
}

interface Volunteer {
  id: string;
  name: string;
  email: string;
  verified: boolean; // Add verified property
}

interface PatientsProps {
  searchTerm: string;
  filter: string;
}

const Patients: React.FC<PatientsProps> = ({ searchTerm, filter }) => {
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

    // Fetch volunteers
    const unsubscribeVolunteers = onSnapshot(
      collection(db, "volunteers"),
      (snapshot) => {
        const volunteerData = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
          id: doc.id,
          ...doc.data(),
        })) as Volunteer[];

        // Filter to get only verified volunteers
        const verifiedVolunteers = volunteerData.filter(volunteer => volunteer.verified);
        setVolunteers(verifiedVolunteers);
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
        await updateDoc(patientRef, {
          status: "Assigned",
          assignedVolunteers: [...(selectedPatient.assignedVolunteers || []), volunteer.id], // Save volunteer UID
        });

        setPatients((prevPatients) =>
          prevPatients.map((p) =>
            p.id === selectedPatient.id ? { ...p, status: "Assigned", assignedVolunteers: [...(p.assignedVolunteers || []), volunteer.id] } : p
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
    <div className="min-h-screen flex flex-col items-center mt-6 rounded-2xl">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl p-6 border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">{filter} Patients</h2>
          <button
            onClick={() => setIsGridView(!isGridView)}
            className="text-gray-600 hover:text-gray-800 flex items-center"
          >
            {isGridView ? <FaThList /> : <FaTh />}
            <span className="ml-2 text-sm">{isGridView ? "List View" : "Grid View"}</span>
          </button>
        </div>

        {/* Patient cards or table view */}
        <div className="max-h-[75vh] overflow-auto">
          {isGridView ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 pt-0">
              {currentPatients.map((patient) => (
                <div
                  key={patient.id}
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
                          : patient.status === "Pending"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600"
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
                {currentPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-100 transition duration-200">
                    <td className="py-2 px-4 border-b">{patient.name}</td>
                    <td className="py-2 px-4 border-b">{patient.email}</td>
                    <td className="py-2 px-4 border-b">{patient.phone}</td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${
                          patient.status === "Assigned"
                            ? "bg-green-100 text-green-600"
                            : patient.status === "Pending"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex space-x-3">
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

        {/* Pagination */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Modals */}
      <CustomModal isOpen={isPatientModalOpen} onClose={closePatientModal}>
        {selectedPatient && (
          <div>
            <h3 className="text-xl font-semibold">{selectedPatient.name}</h3>
            <p className="mt-2">Email: {selectedPatient.email}</p>
            <p className="mt-2">Phone: {selectedPatient.phone}</p>
            <p className="mt-2">Details: {selectedPatient.details}</p>
            <p className="mt-2">Status: {selectedPatient.status}</p>

            {selectedPatient.status === "Pending" && (
              <button
                onClick={openVolunteerModal}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Assign Volunteers
              </button>
            )}
          </div>
        )}
      </CustomModal>

      <CustomModal isOpen={isVolunteerModalOpen} onClose={closeVolunteerModal}>
        <h3 className="text-xl font-semibold">Select Verified Volunteers</h3>
        <div className="mt-4">
          {volunteers.map((volunteer) => (
            <div key={volunteer.id} className="flex items-center justify-between py-2">
              <span>{volunteer.name} ({volunteer.email})</span>
              <button
                onClick={() => assignVolunteerToPatient(volunteer)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Assign
              </button>
            </div>
          ))}
        </div>
      </CustomModal>
    </div>
  );
};

export default Patients;
