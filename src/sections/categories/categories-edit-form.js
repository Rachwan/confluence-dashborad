import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Swal from 'sweetalert2'

const EditCategoryForm = ({ category, onClose, fetchUpdatedData }) => {
  const [formData, setFormData] = useState({
    name: '',
    icon: null,
    background: null,
    activeColor: '',
  })

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        icon: category.icon || '',
        background: category.background || '',
        activeColor: category.activeColor || '',
      })
    }
  }, [category])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_END}/category/${category._id}`,
        formDataToSend,
      )
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
      console.error('Error adding plaform:', error)
    }
  }

  return (
    <Dialog open={!!category} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          width: 400,
          backgroundColor: '#fff',
          borderRadius: '4px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ color: 'var(--second-blue)', fontSize: '25px' }}>Category Details</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label='Name'
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin='normal'
            placeholder='Enter the category name'
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '12px',
            }}
          >
            <label htmlFor='icon' style={{ marginTop: '15px', marginBottom: '15px' }}>
              Upload an icon
            </label>
            <input accept='image/*' id='icon' type='file'
name='icon' onChange={handleIconChange} />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '12px',
            }}
          >
            <label htmlFor='back' style={{ marginTop: '15px', marginBottom: '15px' }}>
              Upload a background
            </label>
            <input
              accept='image/*'
              type='file'
              id='back'
              name='background'
              onChange={handleBackgroundChange}
            />
          </div>
          <TextField
            label='Active Color'
            type='text'
            name='activeColor'
            value={formData.activeColor}
            onChange={handleChange}
            fullWidth
            margin='normal'
            placeholder='Enter the Active Color'
          />

          <Button
            variant='contained'
            type='submit'
            style={{
              backgroundColor: '#163357',
              color: 'white',
              marginTop: '10px',
            }}
          >
            Add Category
          </Button>
        </form>
      </Box>
    </Dialog>
  )
}

export default EditCategoryForm
