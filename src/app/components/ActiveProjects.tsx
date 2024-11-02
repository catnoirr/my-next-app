// src/app/components/ActiveProjects.tsx
"use client";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, QueryDocumentSnapshot, doc, updateDoc } from "firebase/firestore";
import { FaUserPlus, FaEye } from "react-icons/fa";
import { db } from "../firebaseConfig";
import CustomModal from "./CustomModal";
import VolunteerRequest from "./VolunteerRequest"

interface Patient {
  id: string;
  name: string;
  status: string;
  details: string;
}

const ActiveProjects: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
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
    return () => unsubscribe();
  }, []);

  const openModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  const assignVolunteer = async () => {
    if (selectedPatient) {
      try {
        const patientRef = doc(db, "requests", selectedPatient.id);
        await updateDoc(patientRef, { status: "Assigned" });
        setPatients((prevPatients) =>
          prevPatients.map((p) =>
            p.id === selectedPatient.id ? { ...p, status: "Assigned" } : p
          )
        );
        closeModal();
      } catch (error) {
        console.error("Failed to update status:", error);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-8">
      <div className="bg-white rounded-lg shadow-md w-full md:w-2/3 p-6 border">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Patients</h2>
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="text-gray-600">Patient Name</th>
              <th className="text-gray-600">Status</th>
              <th className="text-gray-600">Volunteers</th>
              <th className="text-gray-600">View</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="bg-gray-50 hover:bg-gray-100 rounded-lg">
                <td className="p-2">{patient.name}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${
                      patient.status === "Assigned"
                        ? "bg-green-100 text-green-600"
                        : patient.status === "Pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {patient.status}
                  </span>
                </td>
                <td className="p-2 text-center">
                  <FaUserPlus className="text-purple-500 bg-white rounded-full p-1 w-6 h-6" />
                </td>
                <td className="p-2 text-center">
                  <FaEye
                    className="text-gray-600 cursor-pointer hover:text-gray-800"
                    onClick={() => openModal(patient)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <button className="bg-purple-600 text-white px-4 py-2 rounded-full w-full">
            View All Patients
          </button>
        </div>
      </div>
      <VolunteerRequest/>

      {/* Modal for patient details */}
      <CustomModal isOpen={isModalOpen} onClose={closeModal}>
        {selectedPatient && (
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4">{selectedPatient.name}</h3>
            <p className="text-gray-600 mb-4">{selectedPatient.details}</p>
            <button
              onClick={assignVolunteer}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full shadow-md transition duration-200"
            >
              Assign Volunteer
            </button>
          </div>
        )}
      </CustomModal>
    </div>
  );
};

export default ActiveProjects;
