import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Swal from 'sweetalert2'

const EditCityForm = ({ city, onClose, fetchUpdatedData }) => {
  const [formData, setFormData] = useState({
    name: '',
  })
  useEffect(() => {
    if (city) {
      setFormData({
        name: city.name || '',
      })
    }
  }, [city])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_BACK_END}/city/${city._id}`, {
        name: formData.name,
      })
      fetchUpdatedData()

      Swal.fire({
        title: 'Done',
        text: `${response.data.name} Update it successfully!`,
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
    <Dialog open={!!city} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          width: 400,
          backgroundColor: '#fff',
          borderRadius: '4px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ color: 'var(--second-blue)' }}>City Details</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label='Name'
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin='normal'
            placeholder='Enter the City name'
          />
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
            Edit City
          </Button>
        </form>
      </Box>
    </Dialog>
  )
}

export default EditCityForm
