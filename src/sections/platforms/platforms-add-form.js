import React, { useState } from 'react'
import axios from 'axios'
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Swal from 'sweetalert2'

const PlatfromAddForm = ({ onClose, fetchUpdatedData }) => {
  const [formData, setFormData] = useState({
    name: '',
    icon: null,
    background: null,
    activeColor: '',
  })

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleIconChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      icon: e.target.files[0],
    }))
  }

  const handleBackgroundChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      background: e.target.files[0],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('icon', formData.icon)
      formDataToSend.append('background', formData.background)
      formDataToSend.append('activeColor', formData.activeColor)

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END}/platform/create`,
        formDataToSend,
      )
      fetchUpdatedData()

      Swal.fire({
        title: 'Done',
        text: `${response.data.name} Add it successfully!`,
        icon: 'success',
      })

      onClose()
    } catch (error) {
      if (error.response && error.response.status === 500) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'One field or more is missing.',
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong! Try again.',
        })
        console.error('Error adding plaform:', error)
      }
    }
  }

  return (
    <Dialog open={true} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          width: 400,
          backgroundColor: '#fff',
          borderRadius: '4px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ color: 'var(--second-blue)', fontSize: '25px' }}>Platform Details</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            placeholder="Enter the platform name"
            style={{ fontSize: '20px' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
            <label
              htmlFor="icon"
              style={{ marginTop: '15px', marginBottom: '10px', fontSize: '20px' }}
            >
              Upload an icon
            </label>
            <input accept="image/*" id="icon" type="file" name="icon" onChange={handleIconChange} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '12px' }}>
            <label
              htmlFor="back"
              style={{ marginTop: '15px', marginBottom: '10px', fontSize: '20px' }}
            >
              Upload a background
            </label>
            <input
              accept="image/*"
              type="file"
              id="back"
              name="background"
              onChange={handleBackgroundChange}
            />
          </div>
          <TextField
            label="Active Color"
            type="text"
            name="activeColor"
            value={formData.activeColor}
            onChange={handleChange}
            fullWidth
            margin="normal"
            placeholder="Enter the Active Color"
          />

          <Button
            variant="contained"
            type="submit"
            style={{
              backgroundColor: 'var(--second-blue)',
              color: 'white',
              marginTop: '30px',
              fontSize: '16px',
              width: '100%',
              borderRadius: '30px',
            }}
          >
            Add Platform
          </Button>
        </form>
      </Box>
    </Dialog>
  )
}

export default PlatfromAddForm
