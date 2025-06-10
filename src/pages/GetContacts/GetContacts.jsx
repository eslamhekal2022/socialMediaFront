import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import './getContact.css';

export default function GetContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
                const API = import.meta.env.VITE_API_URL;
  async function getContacts() {
    try {
      const { data } = await axios.get(`${API}/getContacts`);
      if (data.success && Array.isArray(data.data)) {
        setContacts(data.data);
      } else {
        toast.error('Failed to load contacts');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while fetching contacts');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getContacts();

    const socket = io(API, {
      transports: ['websocket'], // لتقليل التأخير
    });

    socket.on("new-contact", (data) => {
      toast.info(data.message || "📩 رسالة جديدة وصلت");
      getContacts(); // تحميل أحدث البيانات
      // ✅ صوت إشعار (لو حبيت)
      const audio = new Audio("/notification.mp3"); // حط الصوت في public
      audio.play();
    });

    return () => {
      socket.disconnect(); // إنهاء الاتصال عند الخروج
    };
  }, []);

  async function deleteContact(id){
    const {data}=await axios.delete(`${API}/deleteContact/${id}`);
    if(data.success){
      toast.success("Contact-Is-Bye")
      setContacts((prev)=>prev.filter((x)=>x._id!==id))
    }
  }

  return (
    <div className="contacts-page">
      <h2>All Contacts</h2>

      {loading ? (
        <p>Loading contacts...</p>
      ) : contacts.length === 0 ? (
        <p>No contacts found.</p>
      ) : (
        <table className="contacts-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.filter((x) => x.userId).map((contact, index) => (
              <tr key={contact._id}>
                <td>{index + 1}</td>
                <td>{contact.userId.name}</td>
                <td>{contact.userId.email}</td>
                <td>{contact.message}</td>
                <td><button onClick={()=>deleteContact(contact._id)}>x</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
