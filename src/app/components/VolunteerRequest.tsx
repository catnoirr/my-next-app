import React, { useEffect, useRef, useState } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import { db } from '../firebaseConfig'; // Adjust the import path as necessary
import { collection, onSnapshot, updateDoc, deleteDoc, doc } from "firebase/firestore";

interface Volunteer {
    id: string;
    name: string;
    email: string;
    verified: boolean;
}

export default function VolunteerRequest() {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [selectedVolunteer, setSelectedVolunteer] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Fetch volunteers from Firestore in real-time
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "volunteers"), (snapshot) => {
            const volunteersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Volunteer[];
            setVolunteers(volunteersData);
        });

        // Cleanup the listener on component unmount
        return () => unsubscribe();
    }, []);

    // Toggle volunteer's status
    const approveVolunteer = async (id: string) => {
        const volunteerDocRef = doc(db, "volunteers", id);
        await updateDoc(volunteerDocRef, { verified: true });
        setSelectedVolunteer(null); // Close the menu after approving
    };

    // Remove volunteer from Firestore
    const removeVolunteer = async (id: string) => {
        await deleteDoc(doc(db, "volunteers", id));
        setSelectedVolunteer(null); // Close the menu after removing
    };

    // Toggle the display of actions menu
    const toggleActionsMenu = (id: string) => {
        setSelectedVolunteer(selectedVolunteer === id ? null : id);
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setSelectedVolunteer(null); // Close the dropdown
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 border">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Volunteer Requests</h2>
            <div className="">
                {volunteers.filter(volunteer => !volunteer.verified).length === 0 ? ( // Check for no unverified volunteers
                    <div className="flex flex-col items-center justify-center py-10">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3M8 12h8a4 4 0 100-8H8a4 4 0 100 8zm0 0a4 4 0 00-4 4v4a4 4 0 004 4h8a4 4 0 004-4v-4a4 4 0 00-4-4H8z" />
                        </svg>
                        <p className="mt-4 text-lg text-gray-600">No New Requests</p>
                    </div>
                ) : (
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-3 px-4 text-left text-gray-600 font-bold">Name</th>
                                <th className="py-3 px-4 text-left text-gray-600 font-bold">Status</th>
                                <th className="py-3 px-4 text-center text-gray-600 font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {volunteers
                                .filter(volunteer => !volunteer.verified) // Only show unverified volunteers
                                .map((volunteer) => (
                                    <tr
                                        key={volunteer.id}
                                        className="bg-white transition duration-300 ease-in-out hover:bg-gray-50 rounded-lg"
                                    >
                                        <td className="py-2 px-4 break-all"> {/* Allow text to break and wrap */}
                                            <div className="text-gray-800 font-medium">{volunteer.name}</div>
                                            <div className="text-gray-500 text-sm">{volunteer.email}</div>
                                        </td>
                                        <td className="py-2 px-4"> {/* Standard padding */}
                                            <span
                                                className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                                                    volunteer.verified
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                }`}
                                            >
                                                {volunteer.verified ? 'Verified' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 text-center relative flex flex-col items-center"> {/* Use flex for stacking */}
                                            <button
                                                className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
                                                onClick={() => toggleActionsMenu(volunteer.id)}
                                            >
                                                <FiMoreVertical size={20} />
                                            </button>
                                            {selectedVolunteer === volunteer.id && (
                                                <div
                                                    ref={menuRef}
                                                    className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                                                >
                                                    <button
                                                        onClick={() => alert(`Viewing ID for ${volunteer.name}`)}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                    >
                                                        View ID
                                                    </button>
                                                    {!volunteer.verified && (
                                                        <button
                                                            onClick={() => approveVolunteer(volunteer.id)}
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => removeVolunteer(volunteer.id)}
                                                        className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100 w-full text-left"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
