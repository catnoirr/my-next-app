"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig'; 
import { collection, getDocs, query, where } from 'firebase/firestore';
import Sidebar from '../components/Sidebar';
import Modal from './Modal'; // Import your Modal component here

interface Volunteer {
  id: string;
  name: string;
  email: string;
}

interface Message {
  id: string;
  name: string; // Name of the sender
  details: string; // Content of the message
}

const Chat: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>([]);
  const [selectedUser, setSelectedUser] = useState<Volunteer | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchVolunteers = async () => {
      const volunteersCollection = collection(db, 'volunteers');
      const volunteersSnapshot = await getDocs(volunteersCollection);
      const volunteersData = volunteersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Volunteer[];
      setVolunteers(volunteersData);
      setFilteredVolunteers(volunteersData);
    };

    fetchVolunteers();
  }, []);

  const handleSelectUser = (user: Volunteer) => {
    setSelectedUser(user);
    setShowModal(false);
    fetchMessages(user.id); // Fetch messages for the selected user
  };

  const fetchMessages = async (userId: string) => {
    const messagesCollection = collection(db, 'messages');
    const messagesQuery = query(messagesCollection, where("volunteerId", "==", userId)); // Filter messages by userId
    const messagesSnapshot = await getDocs(messagesQuery);
    const messagesData = messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Message[];
    setMessages(messagesData);
  };

  const handleNewChatClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredVolunteers(volunteers.filter(volunteer => 
      volunteer.name.toLowerCase().includes(term) || 
      volunteer.email.toLowerCase().includes(term)
    ));
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 w-full gap-6 h-screen">
      <div className='md:ml-5'><Sidebar/></div>

      <div className="flex-1 p-6 bg-white shadow-lg rounded-lg mt-3 md:m-5 m-3 mb-4">
        <h2 className="text-2xl font-bold mb-4 flex justify-between items-center">
          Chat
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded shadow"
            onClick={handleNewChatClick}
          >
            New Chat
          </button>
        </h2>

        {/* Modal for selecting volunteers */}
        <Modal isOpen={showModal} onClose={handleModalClose}>
          <h3 className="text-lg font-semibold mb-2">Select a Volunteer</h3>
          <input
            type="text"
            placeholder="Search volunteers..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border rounded-lg p-2 mb-4 w-full"
          />
          <div className="max-h-60 overflow-y-auto">
            <div className="grid grid-cols-1 gap-4">
              {filteredVolunteers.map((volunteer) => (
                <div
                  key={volunteer.id}
                  className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectUser(volunteer)}
                >
                  <h4 className="font-bold">{volunteer.name}</h4>
                  <p className="text-gray-600">{volunteer.email}</p>
                </div>
              ))}
            </div>
          </div>
        </Modal>

        {/* Show selected user information */}
        {selectedUser && (
          <div className="border-b mb-4 pb-2">
            <h3 className="text-lg">{selectedUser.name}</h3>
            <p className="text-gray-600">{selectedUser.email}</p>
          </div>
        )}

        {/* Chat messages */}
        <div className="overflow-y-auto h-72 border rounded-lg bg-gray-50 p-4 mb-4">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">No messages yet.</p>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="mb-2">
                <div className="font-semibold">{message.name}</div>
                <div className="text-gray-600">{message.details}</div>
              </div>
            ))
          )}
        </div>

        {/* Message input section */}
        <div className="flex">
          <input
            type="text"
            placeholder="Type your message..."
            className="border rounded-lg p-2 flex-1"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2">Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
