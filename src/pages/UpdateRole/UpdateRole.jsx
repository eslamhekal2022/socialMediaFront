import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import './updateRole.css'
import { useUser } from '../../context/userContext.jsx'

export default function UpdateRole() {
  const { getAllUser } = useUser()
  const { id } = useParams()
  const [user, setUser] = useState({})
  const [role, setRole] = useState("")
  const navigate = useNavigate()
            const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    getUser()
  }, [])

  async function getUser() {
    try {
      const { data } = await axios.get(`${API}/getuser/${id}`)
      if (data.success) {
        setUser(data.data)
        setRole(data.data.role)
      }
    } catch (err) {
      toast.error("Failed to fetch user")
    }
  }

  async function handleUpdateRole(e) {
    e.preventDefault()
    try {
      const { data } = await axios.put(`${API}/update-role/${id}`, { role })

      if (data.success) {
        toast.success("Role updated successfully")
        const storedUser = localStorage.getItem("user")
        const currentUser = storedUser ? JSON.parse(storedUser) : null
        if (currentUser?.id === id) {
          const updatedUser = await axios.get(`${API}/getuser/${id}`);
          localStorage.setItem("user", JSON.stringify(updatedUser.data.data));
        }

        getAllUser()
        navigate("/AllUser")
      } else {
        toast.error("Failed to update role")
      }
    } catch (err) {
      toast.error("Error updating role")
    }
  }

  return (
    <div className='update-role-container'>
      <form className='update-role-card' onSubmit={handleUpdateRole}>
        <span className='exit-button' onClick={() => navigate("/adminPanel/AllUser")}>×</span>
        <h2>Update Role</h2>
        <div className='form-group'>
          <label>Username:</label>
          <input type='text' value={user.name || ''} readOnly />
        </div>
        <div className='form-group'>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value='user'>User</option>
            <option value='admin'>Admin</option>
            <option value='moderator'>moderator</option>
          </select>
        </div>
        <button type='submit'>Update Role</button>
      </form>
    </div>
  )
}
