import React, { useState } from 'react'
import axios from 'axios'
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Swal from 'sweetalert2'

const CityAddForm = ({ onClose, fetchUpdatedData }) => {
  const [formData, setFormData] = useState({
    name: '',
  })

  const handleChange = (e) => {
    setFormData({
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_END}/city/create`, {
        name: formData.name,
      })
      fetchUpdatedData()

      Swal.fire({
        title: 'Done',
        text: `${response.data.name} Add it successfully!`,
        icon: 'success',
      })

      onClose()
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Try again.',
      })
      console.error('Error adding city:', error)
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
        <h2 style={{ color: 'var(--second-blue)', fontSize: '25px' }}>City Details</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            type="text"
            name="name"
            onChange={handleChange}
            fullWidth
            margin="normal"
            placeholder="Enter the city name"
            style={{ fontSize: '20px' }}
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
            Add City
          </Button>
        </form>
      </Box>
    </Dialog>
  )
}

export default CityAddForm
