import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Swal from 'sweetalert2'

const AdminAddForm = ({ onClose, fetchUpdatedData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    number: '',
    profile: null,
    role: 'admin',
  })

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleProfileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      profile: e.target.files[0],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.categoryId === '') {
      Swal.fire({
        title: 'Have you selected your category?',
        text: 'Please select your category.',
        icon: 'question',
      })
      return
    }
    if (formData.cityId === '') {
      Swal.fire({
        title: 'Have your selected you city?',
        text: 'Please select your city.',
        icon: 'question',
      })
      return
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END}/user/add/user`,
        { ...formData, role: 'admin' },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      fetchUpdatedData()

      Swal.fire({
        title: 'Done',
        text: `${response.data.name} Add it successfully!`,
        icon: 'success',
      })
      console.log(formData)
      onClose()
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Email alerady exist.',
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong! Try again.',
        })
        console.error('Error adding admin:', error)
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
        <h2 style={{ color: 'var(--second-blue)', fontSize: '25px' }}>Admin Details</h2>
        <form onSubmit={handleSubmit} encType='multipart/form-data'>
          <TextField
            label='Name'
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin='normal'
            placeholder='admin name'
            style={{ fontSize: '20px' }}
          />
          <TextField
            label='Email'
            type='email'
            name='email'
            onChange={handleChange}
            fullWidth
            margin='normal'
            placeholder='Admin email'
            style={{ fontSize: '20px' }}
          />
          <TextField
            label='Password'
            type='password'
            name='password'
            onChange={handleChange}
            fullWidth
            margin='normal'
            placeholder='admin password'
            style={{ fontSize: '20px' }}
          />
          <TextField
            label='Phone'
            type='text'
            name='number'
            onChange={handleChange}
            fullWidth
            margin='normal'
            placeholder='Admin number'
            style={{ fontSize: '20px' }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '20px',
            }}
          >
            <label
              htmlFor='pro'
              style={{
                marginTop: '15px',
                marginBottom: '10px',
                fontSize: '20px',
              }}
            >
              Upload the profile
            </label>
            <input
              accept='image/*'
              id='pro'
              type='file'
              name='profile'
              onChange={handleProfileChange}
            />
          </div>

          <Button
            variant='contained'
            type='submit'
            style={{
              backgroundColor: 'var(--second-blue)',
              color: 'white',
              marginTop: '30px',
              fontSize: '16px',
              width: '100%',
              borderRadius: '30px',
            }}
          >
            Add Admin
          </Button>
        </form>
      </Box>
    </Dialog>
  )
}

export default AdminAddForm
