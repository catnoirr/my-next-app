import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  QueryDocumentSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { FaEye, FaTrash, FaThList, FaTh, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { db } from "../firebaseConfig";
import PatientModal from "./PatientModal";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  details: string;
  status?: string;
  address: string;
}

interface PatientsProps {
  searchTerm: string;
  filter: string;
}

const Patients: React.FC<PatientsProps> = ({ searchTerm, filter }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
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

    return () => {
      unsubscribePatients();
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

  const onUpdateStatus = async (newStatus: string) => {
    if (selectedPatient) {
      try {
        const patientRef = doc(db, "requests", selectedPatient.id);
        await updateDoc(patientRef, { status: newStatus });
        setPatients((prevPatients) =>
          prevPatients.map((p) =>
            p.id === selectedPatient.id ? { ...p, status: newStatus } : p
          )
        );
      } catch (error) {
        console.error("Failed to update patient status:", error);
      }
    }
  };

  const onDeletePatient = async (patientId: string) => {
    try {
      await deleteDoc(doc(db, "requests", patientId));
      setPatients((prevPatients) => prevPatients.filter((p) => p.id !== patientId));
    } catch (error) {
      console.error("Failed to delete patient:", error);
    }
  };

  const filteredPatients = patients
    .filter((patient) => filter === "All" || patient.status === filter)
    .filter((patient) => patient.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
    <div className="flex flex-col items-center mt-6 bg-gray-100 rounded-xl">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl p-6 border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">{filter} Patients</h2>
          <button
            onClick={() => setIsGridView(!isGridView)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            {isGridView ? <FaThList /> : <FaTh />}
          </button>
        </div>

        {isGridView ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
            {currentPatients.map((patient) => (
              <div
                key={patient.id}
                className="bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-700 mb-1">{patient.name}</h3>
                <p className="text-sm text-gray-500 mb-1">Email: {patient.email}</p>
                <p className="text-sm text-gray-500 mb-1">Phone: {patient.phone}</p>
                <p className="text-sm text-gray-500">Status: {patient.status}</p>
                <button
                  onClick={() => openPatientModal(patient)}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  <FaEye /> View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <table className="min-w-full border bg-white rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-sm">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left hidden md:table-cell">Email</th>
                <th className="py-3 px-4 text-left hidden md:table-cell">Phone</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.map((patient) => (
                <tr key={patient.id} className="border-t">
                  <td className="py-4 px-4 text-gray-700">{patient.name}</td>
                  <td className="py-4 px-4 text-gray-500 hidden md:table-cell">{patient.email}</td>
                  <td className="py-4 px-4 text-gray-500 hidden md:table-cell">{patient.phone}</td>
                  <td className="py-4 px-4 text-gray-500">{patient.status}</td>
                  <td className="py-4 px-4 text-center flex justify-center space-x-2">
                    <button
                      onClick={() => openPatientModal(patient)}
                      className="text-blue-500 hover:text-blue-600"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => onDeletePatient(patient.id)}
                      className=" text-red-500 hover:text-red-600"
                      title="Delete Patient"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded flex items-center"
          >
            <FaChevronLeft /> Prev
          </button>
          <p className="text-lg font-semibold text-gray-700">
            Page {currentPage} of {totalPages}
          </p>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded flex items-center"
          >
            Next <FaChevronRight />
          </button>
        </div>
      </div>

      {isPatientModalOpen && (
        <PatientModal
          isOpen={isPatientModalOpen}
          onClose={closePatientModal}
          patient={selectedPatient}
          onUpdateStatus={onUpdateStatus}
        />
      )}
    </div>
  );
};

export default Patients;