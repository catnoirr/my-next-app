import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, QueryDocumentSnapshot, doc, updateDoc, getDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  verified: boolean; // Assuming this field exists in your data model
  status?: string;
}

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  details: string;
  status?: string;
  address: string;
  assignedVolunteers?: string[]; // Array of assigned volunteer IDs
}

type PatientModalProps = {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onUpdateStatus: (newStatus: string) => void;
};

const PatientModal: React.FC<PatientModalProps> = ({
  isOpen,
  onClose,
  patient,
  onUpdateStatus,
}) => {
  const [allVolunteers, setAllVolunteers] = useState<Volunteer[]>([]);
  const [showVolunteerList, setShowVolunteerList] = useState(false);

  useEffect(() => {
    const unsubscribeVolunteers = onSnapshot(collection(db, "volunteers"), (snapshot) => {
      const volunteersData = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data(),
      })) as Volunteer[]; // Cast to Volunteer[]
      setAllVolunteers(volunteersData.filter(volunteer => volunteer.verified)); // Filter only verified volunteers
    });

    return () => {
      unsubscribeVolunteers();
    };
  }, []);

  const handleAssignVolunteer = async (volunteerId: string) => {
    if (!patient) return;

    try {
      // Reference to the patient document
      const patientRef = doc(db, "patients", patient.id);
      
      // Check if the patient document exists
      const patientDoc = await getDoc(patientRef);
      if (!patientDoc.exists()) {
        console.error("No such patient document!");
        return; // Exit if the document does not exist
      }

      // Prepare the new assigned volunteers list
      const newAssignedVolunteers = [...(patient.assignedVolunteers || []), volunteerId]; // Append the new volunteer ID

      // Update the patient document
      await updateDoc(patientRef, {
        status: "Assigned", // Change status to Assigned
        assignedVolunteers: newAssignedVolunteers, // Update assigned volunteers
      });

      // Save the assignment in the requests collection
      await addDoc(collection(db, "requests"), {
        patientId: patient.id,
        volunteerId: volunteerId,
        assignedAt: new Date(), // Timestamp of the assignment
        status: "Assigned" // Status of the request
      });

      // Update the volunteer's status to "Assigned"
      const volunteerRef = doc(db, "volunteers", volunteerId);
      await updateDoc(volunteerRef, { status: "Assigned" });

      console.log("Patient updated successfully:", patient.id);
      onUpdateStatus("Assigned"); // Update status in the modal
      setShowVolunteerList(false); // Close the volunteer list after assignment
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-lg max-h-[90vh] overflow-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <span className="sr-only">Close</span>
          &times;
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 p-6 border-b pb-4">
          <h2 className="text-lg md:text-xl font-semibold">Patient Details</h2>
          <span className="text-gray-500 text-sm mt-2 md:mt-0">Patient ID: {patient.id}</span>
        </div>

        <div className="flex flex-col-reverse md:flex-row gap-6 p-6 pt -0">
          <div className="flex-1 space-y-4">
            <p className="text-green-700 font-semibold text-lg">Details</p>
            <p className="text-gray-600">{patient.details}</p>
          </div>

          <div className="flex-1 border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-700 font-medium text-sm">Patient name</p>
                <p className="text-lg font-semibold">{patient.name}</p>
              </div>
              <select
                className="border border-gray-300 rounded p-2 text-sm"
                value={patient.status}
                onChange={(e) => onUpdateStatus(e.target.value)}
              >
                <option value="Assigned">Assigned</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div className="space-y-2">
              <p className="text-gray-700 font-medium text-sm">Phone: <span className="font-semibold">{patient.phone}</span></p>
              <p className="text-gray-700 font-medium text-sm">Email: <span className="font-semibold">{patient.email}</span></p>
              <p className="text-gray-700 font-medium text-sm">Address: <span className="font-semibold">{patient.address}</span></p>
            </div>

            <div className="mt-6 flex flex-col md:flex-row gap-4">
              {patient.status === "Pending" ? (
                <button
                  className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => setShowVolunteerList(true)}
                >
                  Assign Volunteers
                </button>
              ) : (
                <button
                  className="w-full md:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => setShowVolunteerList(true)}
                >
                  View Volunteers
                </button>
              )}
              <button className="w-full md:w-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={onClose}>Cancel</button>
            </div>
          </div>
        </div>

        {showVolunteerList && (
          <div className="p-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Available Volunteers</h3>
            <div className="max-h-60 overflow-y-auto">
              {allVolunteers.map((volunteer) => (
                <div key={volunteer.id} className="flex justify-between items-center p-2 border-b">
                  <div>
                    <p className="text-gray-700">{volunteer.name}</p>
                    <p className="text-gray-500 text-sm">{volunteer.email} | {volunteer.phone}</p>
                  </div>
                  {patient.status === "Pending" && (
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleAssignVolunteer(volunteer.id)}
                    >
                      Assign
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              className="mt-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              onClick={() => setShowVolunteerList(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientModal;
