// "use client";
// import React, { useEffect, useState } from "react";
// import { collection, onSnapshot, QueryDocumentSnapshot, doc, updateDoc } from "firebase/firestore";
// import { FaEye } from "react-icons/fa";
// import { db } from "../firebaseConfig";
// import CustomModal from "./CustomModal";
// import VolunteerRequest from "./VolunteerRequest";

// interface Patient {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   location: string;
//   status: string;
//   details: string;
//   assignedVolunteer?: string;
// }

// interface Volunteer {
//   id: string;
//   name: string;
//   email: string;
//   phone: string; // Added phone field
//   location: string;
// }

// const ActiveProjects: React.FC = () => {
//   const [patients, setPatients] = useState<Patient[]>([]);
//   const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
//   const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
//   const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//   const [assignedVolunteerDetails, setAssignedVolunteerDetails] = useState<Volunteer | null>(null);

//   useEffect(() => {
//     // Fetch patients from 'requests' collection
//     const unsubscribe = onSnapshot(
//       collection(db, "requests"),
//       (snapshot) => {
//         const patientData = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
//           id: doc.id,
//           ...doc.data(),
//         })) as Patient[];
//         setPatients(patientData);
//       },
//       (error) => {
//         console.error("Error fetching patients:", error);
//       }
//     );

//     // Fetch volunteers from 'volunteers' collection
//     const unsubscribeVolunteers = onSnapshot(
//       collection(db, "volunteers"),
//       (snapshot) => {
//         const volunteerData = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
//           id: doc.id,
//           ...doc.data(),
//         })) as Volunteer[];
//         setVolunteers(volunteerData);
//       },
//       (error) => {
//         console.error("Error fetching volunteers:", error);
//       }
//     );

//     return () => {
//       unsubscribe();
//       unsubscribeVolunteers();
//     };
//   }, []);

//   const openVolunteerModal = (patient: Patient) => {
//     setSelectedPatient(patient);
//     setIsVolunteerModalOpen(true);
//   };

//   const closeVolunteerModal = () => {
//     setIsVolunteerModalOpen(false);
//     setSelectedPatient(null);
//   };

//   const openDetailModal = (patient: Patient) => {
//     setSelectedPatient(patient);
//     if (patient.assignedVolunteer) {
//       const assignedVolunteer = volunteers.find((v) => v.name === patient.assignedVolunteer);
//       setAssignedVolunteerDetails(assignedVolunteer || null);
//     }
//     setIsDetailModalOpen(true);
//   };

//   const closeDetailModal = () => {
//     setIsDetailModalOpen(false);
//     setSelectedPatient(null);
//     setAssignedVolunteerDetails(null);
//   };

//   const assignVolunteer = async (volunteerId: string, volunteerName: string) => {
//     if (selectedPatient) {
//       try {
//         const patientRef = doc(db, "requests", selectedPatient.id);
//         await updateDoc(patientRef, { status: "Assigned", assignedVolunteer: volunteerName });
//         setPatients((prevPatients) =>
//           prevPatients.map((p) =>
//             p.id === selectedPatient.id
//               ? { ...p, status: "Assigned", assignedVolunteer: volunteerName }
//               : p
//           )
//         );
//         closeVolunteerModal();
//       } catch (error) {
//         console.error("Failed to update status:", error);
//       }
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row gap-4 md:p-8">
//       <div className="bg-white rounded-lg shadow-md w-full md:w-2/3 p-4 md:p-6 border">
//         <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Active Patients</h2>
//         <div className="overflow-y-scroll max-h-60 md:max-h-96 no-scrollbar thin-scrollbar scroll-container">
//           <table className="w-full text-left border-separate border-spacing-y-1 md:border-spacing-y-2">
//             <thead>
//               <tr>
//                 <th className="text-gray-600 text-xs md:text-base">Patient Name</th>
//                 <th className="text-gray-600 text-xs md:text-base">Status</th>
//                 <th className="text-gray-600 text-xs md:text-base">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {patients.map((patient) => (
//                 <tr key={patient.id} className="bg-gray-50 hover:bg-gray-100 rounded-lg">
//                   <td className="p-1 md:p-2 text-xs md:text-base">{patient.name}</td>
//                   <td className="p-1 md:p-2">
//                     <span
//                       className={`px-2 py-1 text-xs md:text-sm rounded-full ${
//                         patient.status === "Assigned"
//                           ? "bg-green-100 text-green-600"
//                           : patient.status === "Pending"
//                           ? "bg-yellow-100 text-yellow-600"
//                           : "bg-gray-100 text-gray-600"
//                       }`}
//                     >
//                       {patient.status}
//                     </span>
//                   </td>
//                   <td className="p-1 md:p-2 text-center">
//                     {patient.status === "Pending" ? (
//                       <button
//                         onClick={() => openVolunteerModal(patient)}
//                         className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs"
//                       >
//                         Assign
//                       </button>
//                     ) : (
//                       <FaEye
//                         className="text-gray-600 cursor-pointer hover:text-gray-800"
//                         onClick={() => openDetailModal(patient)}
//                       />
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       <VolunteerRequest />

//       {/* Modal for selecting a volunteer */}
//       <CustomModal isOpen={isVolunteerModalOpen} onClose={closeVolunteerModal}>
//         <div className="p-4">
//           <h3 className="text-xl font-semibold text-gray-800 mb-4">Assign Volunteer</h3>
//           <div className="overflow-y-auto max-h-60">
//             <ul>
//               {volunteers.map((volunteer) => (
//                 <li key={volunteer.id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg">
//                   <div>
//                     <p className="font-medium text-gray-800">{volunteer.name}</p>
//                     <p className="text-sm text-gray-600">{volunteer.email}</p>
//                     <p className="text-sm text-gray-600">{volunteer.phone}</p>
//                     <p className="text-sm text-gray-600">{volunteer.location}</p>
//                   </div>
//                   <button
//                     onClick={() => assignVolunteer(volunteer.id, volunteer.name)}
//                     className="bg-blue-500 text-white px-4 py-1 rounded-lg text-xs"
//                   >
//                     Assign
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </CustomModal>

//       {/* Modal for viewing assigned volunteer details */}
//       <CustomModal isOpen={isDetailModalOpen} onClose={closeDetailModal}>
//         {assignedVolunteerDetails && (
//           <div className="text-center p-6 sm:p-8">
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">Assigned Volunteer</h3>
//             <p className="text-gray-600">Name: {assignedVolunteerDetails.name}</p>
//             <p className="text-gray-600">Email: {assignedVolunteerDetails.email}</p>
//             <p className="text-gray-600">Phone: {assignedVolunteerDetails.phone}</p>
//             <p className="text-gray-600">Location: {assignedVolunteerDetails.location}</p>
//           </div>
//         )}
//       </CustomModal>
//     </div>
//   );
// };

// export default ActiveProjects;
import VolunteerRequest from "./VolunteerRequest";

import AllNewPatients from './NewRequest';

export default function ActiveProjects() {
  return (
    <div>
      <main className="flex flex-col gap-7">
        <AllNewPatients searchTerm="" filter="All" />
       
    <div>
         <VolunteerRequest />
         </div>
      </main>
    </div>
  );
}
