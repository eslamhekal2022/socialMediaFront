import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import './updateRole.css'
import { useUser } from '../../context/userContext.jsx'

export default function UpdateRole() {
  const { getAllUser } = useUser()
  const { userId } = useParams()
  const [user, setUser] = useState({})
  const [role, setRole] = useState("")
  const navigate = useNavigate()
    const API=import.meta.env.VITE_API_URL

  useEffect(() => {
    getUser()
  }, [])

  async function getUser() {
    try {
      const { data } = await axios.get(`${API}/getuser/${userId}`)
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
    const response = await axios.put(`${API}/update-role/${userId}`, { role })

    if (response.data?.success) {
      toast.success("Role updated successfully")
navigate("/AllUser")
      const storedUser = localStorage.getItem("user")
      const currentUser = storedUser ? JSON.parse(storedUser) : null

      if (String(currentUser?.id) === String(userId)) {
        try {
          const updatedUser = await axios.get(`${API}/getuser/${userId}`)
          localStorage.setItem("user", JSON.stringify(updatedUser.data.data))
        } catch (err) {
          console.warn("User updated but failed to refresh local user data")
        }
      }

      getAllUser()
    } else {
      toast.error(response.data.message || "Failed to update role")
    }
  } catch (err) {
    console.error("Unexpected error:", err)
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
