import { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { UserContext } from 'src/contexts/UserContext'
import Swal from 'sweetalert2'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField,
} from '@mui/material'

export const SettingsPassword = () => {
  const { user, setUser, setUserUpdated } = useContext(UserContext)
  const [newPassword, setNewPassword] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')
  const [formData, setFormData] = useState({
    email: user?.email,
  })

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const passwordRegex = /^.{8,}$/

  const handleInputChange = (event) => {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!formData.email && !formData.oldPasswordInput && !formData.password && !verifyPassword) {
      Swal.fire({
        title: 'Have you inserted anything?',
        text: 'Please update at least one field.',
        icon: 'question',
      })
      return
    }

    if (formData.email && !emailRegex.test(formData.email)) {
      Swal.fire({
        title: 'Your Email?',
        text: 'Please enter a valid email.',
        icon: 'question',
      })
      return
    }

    /* */
    if (formData.oldPasswordInput) {
      if (!passwordRegex.test(formData.oldPasswordInput)) {
        Swal.fire({
          title: 'Your Old password?',
          text: 'Old password should be at least 8 characters.',
          icon: 'question',
        })
        return
      }
      if (!formData.password) {
        Swal.fire({
          title: 'Your password?',
          text: 'Enter the New password.',
          icon: 'question',
        })
        return
      }
      if (formData.oldPasswordInput && !verifyPassword) {
        Swal.fire({
          title: 'Your password?',
          text: 'Enter the verfiy password.',
          icon: 'question',
        })
        return
      }
      if (!passwordRegex.test(formData.password)) {
        Swal.fire({
          title: 'Your new password?',
          text: 'New password should be at least 8 characters.',
          icon: 'question',
        })
        return
      }
      if (!passwordRegex.test(verifyPassword)) {
        Swal.fire({
          title: 'Your verify password?',
          text: 'Verify password should be at least 8 characters.',
          icon: 'question',
        })
        return
      }
      if (formData.password !== verifyPassword) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Passwords do not match.',
          icon: 'question',
        })
        return
      }
    }

    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_BACK_END}/user/${user?._id}`, {
        ...formData,
        password: newPassword,
        oldPasswordInput: oldPassword,
      })
      if (response.data) {
        setUser(response.data)
        Swal.fire({
          title: 'Done',
          text: `Data updated successfully!`,
          icon: 'success',
        })
        setNewPassword('')
        setVerifyPassword('')
        setOldPassword('')
        setUserUpdated(true)
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Your old password is not correct.',
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error updating user data.',
        })
      }
    }
  }

  useEffect(() => {
    const updateUserInContext = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_END}/logged-in-userId`)
        setUser(response.data.user)
      } catch (err) {
        console.log(err)
      }
    }

    updateUserInContext()

    return () => {
      updateUserInContext()
    }
  }, [setUser])

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <Card>
        <CardHeader subheader="Update your email or password" title="Email & Password" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 400 }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              onChange={handleInputChange}
              defaultValue={user?.email}
            />
            <TextField
              fullWidth
              label="Old Password"
              name="oldPasswordInput"
              type="password"
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value)
                handleInputChange(e)
              }}
            />
            <TextField
              fullWidth
              label="New Password"
              name="password"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                handleInputChange(e)
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              name="verifyPassword"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
            />
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            style={{
              fontSize: '16px',
              backgroundColor: 'var(--second-blue)',
              borderRadius: '30px',
              border: 'none',
              outline: 'none',
            }}
          >
            Update
          </Button>
        </CardActions>
      </Card>
    </form>
  )
}
