import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import Head from 'next/head'
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import TextField from '@mui/material/TextField'
import Swal from 'sweetalert2'
import { UserContext } from 'src/contexts/UserContext'
import styles from '../../styles/influencer-details.module.css'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import LoadingSection from 'src/components/LoadingSection'

const Page = () => {
  const { user, fetchUserData } = useContext(UserContext)
  const [formData, setFormData] = useState({
    age: user?.age ? user?.age : '',
    gender: user?.gender ? user?.gender : '',
    number: user?.number ? user?.number : '',
    platforms: user?.platforms || [],
    profile: user?.profile ? user?.profile : null,
    background: user?.background ? user?.background : null,
    cityId: user?.cityId ? user?.cityId._id : '',
    categoryId: user?.categoryId ? user?.categoryId._id : '',
  })
  const [loading, setLoading] = useState(true)

  /* Fethcing neccessary data */
  const [categoriesData, setCategoriesData] = useState([])

  const fetchCategoriesData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_END}/category/all`)
      setCategoriesData(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchCategoriesData()
  }, [])

  /* */

  const [platformsData, setPlatformsData] = useState([])

  const fetchPlatformsData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_END}/platform/all`)
      setPlatformsData(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchPlatformsData()
    setLoading(false)
  }, [])

  /* */

  const [citiesData, setCitiesData] = useState([])

  const fetchCitiesData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_END}/city/all`)
      setCitiesData(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchCitiesData()
  }, [])

  /* Fetching ends here */

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleCheckboxChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      gender: e.target.checked ? e.target.value : '',
    }))
  }

  const handlePlatformsChange = (e, thePlatform) => {
    const { value } = e.target

    const existingPlatformIndex = formData?.platforms?.findIndex((platform) => {
      const existingPlatformId = platform?.platformId

      if (existingPlatformId && typeof existingPlatformId === 'object') {
        // If platformId is an object, compare its _id property
        return existingPlatformId._id?.toString() === thePlatform?._id?.toString()
      } else {
        // If platformId is not an object, compare it directly
        return existingPlatformId?.toString() === thePlatform?._id?.toString()
      }
    })
    const updatedPlatforms = [...formData.platforms]
    if (existingPlatformIndex !== -1) {
      // Update existing platform
      updatedPlatforms[existingPlatformIndex] = {
        ...updatedPlatforms[existingPlatformIndex],
        followers: value,
      }
    } else {
      // Add new platform
      updatedPlatforms.push({
        platformId: thePlatform._id,
        followers: value,
      })
    }

    setFormData((prevData) => ({
      ...prevData,
      platforms: updatedPlatforms,
    }))
  }

  const handlePlatformsLinkChange = (e, thePlatform) => {
    const { value } = e.target

    const existingPlatformIndex = formData?.platforms?.findIndex((platform) => {
      const existingPlatformId = platform?.platformId

      if (existingPlatformId && typeof existingPlatformId === 'object') {
        // If platformId is an object, compare its _id property
        return existingPlatformId._id?.toString() === thePlatform?._id?.toString()
      } else {
        // If platformId is not an object, compare it directly
        return existingPlatformId?.toString() === thePlatform?._id?.toString()
      }
    })
    const updatedPlatforms = [...formData.platforms]

    if (existingPlatformIndex !== -1) {
      // Update existing platform
      updatedPlatforms[existingPlatformIndex] = {
        ...updatedPlatforms[existingPlatformIndex],
        link: value,
      }
    } else {
      // Add new platform
      updatedPlatforms.push({
        platformId: thePlatform._id,
        link: value,
      })
    }

    setFormData((prevData) => ({
      ...prevData,
      platforms: updatedPlatforms,
    }))
  }

  const handleProfileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      profile: e.target.files[0],
    }))
  }

  const handleBackgroundChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      background: e.target.files[0],
    }))
  }

  /* Regex */
  const phoneRegex = /^\d{8,}$/

  const handleSubmit = async (e) => {
    e.preventDefault()

    /* Validations */
    if (!formData.age) {
      Swal.fire({
        title: 'Have you inserted your age?',
        text: 'Please insert your age.',
        icon: 'question',
      })
      return
    }
    if (!formData.gender || formData.gender === '') {
      Swal.fire({
        title: 'Have you selected your gender?',
        text: 'Please select your gender.',
        icon: 'question',
      })
      return
    }
    if (!formData.number) {
      Swal.fire({
        title: 'Have you inserted your phone?',
        text: 'Please insert your phone.',
        icon: 'question',
      })
      return
    }
    if (!phoneRegex.test(formData.number)) {
      Swal.fire({
        title: 'Have you provided a valid phone?',
        text: 'Please insert a valid phone (at least 8 digits).',
        icon: 'question',
      })
      return
    }
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
    if (formData.profile == null) {
      Swal.fire({
        title: 'Have you uploaded you profile?',
        text: 'Please upload your profile picture.',
        icon: 'question',
      })
      return
    }
    if (formData.background == null) {
      Swal.fire({
        title: 'Have you uploaded you background?',
        text: 'Please upload your background picture.',
        icon: 'question',
      })
      return
    }

    if (formData.platforms.length === 0) {
      Swal.fire({
        title: 'Have you inserted any platform?',
        text: 'Please insert at least one platfrom.',
        icon: 'question',
      })
      return
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_END}/user/${user?._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      await fetchUserData()
      setFormData({})
      Swal.fire({
        title: 'Done',
        text: `${response.data.name}, your info updated successfully!`,
        icon: 'success',
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Try again.',
      })
      console.error('Error updaing influencer:', error)
    }
  }

  return (
    <>
      <Head>
        <title>Influencer Details | Confluence</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1} sx={{ display: 'flex' }}>
                <Typography variant="h4">My Details</Typography>
              </Stack>
            </Stack>
          </Stack>
          <Box
            sx={{
              backgroundColor: '#fff',
            }}
          >
            <h2 style={{ color: 'var(--second-blue)', fontSize: '17px', margin: '20px 0 30px' }}>
              Please Insert all the details below.
            </h2>
            <form className={styles.form} onSubmit={handleSubmit} encType="multipart/form-data">
              {/* All Inputs */}
              <div className={styles.all__inputs}>
                {/* All Info Besides Platfroms */}
                <div className={styles.inputs}>
                  <h2 className={styles.input__title} style={{ fontSize: '22px' }}>
                    Personal Info
                  </h2>
                  <TextField
                    label="Age"
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    placeholder="Insert your age"
                    style={{ marginBottom: '15px', width: '100%' }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '30px',
                      marginBottom: '15px',
                    }}
                  >
                    <p style={{ fontSize: '17px' }}>Gender:</p>
                    <div>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.gender === 'Male'}
                            onChange={(e) => handleCheckboxChange(e)}
                            value="Male"
                          />
                        }
                        label="Male"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.gender === 'Female'}
                            onChange={(e) => handleCheckboxChange(e)}
                            value="Female"
                          />
                        }
                        label="Female"
                      />
                    </div>
                  </div>
                  <TextField
                    label="Phone"
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    placeholder="Insert your number"
                    style={{ marginTop: '0px', marginBottom: '15px' }}
                  />

                  {/* Category */}
                  <div className="select__wrapper">
                    <label className="label" htmlFor="dropdown">
                      Category
                    </label>
                    <div className="arrow">
                      <select
                        name="categoryId"
                        id="dropdown"
                        onChange={handleChange}
                        value={formData.categoryId || ''}
                        className="select"
                      >
                        <option
                          value={user?.categoryId ? user?.categoryId : ''}
                          className="option__title"
                        >
                          {user?.categoryId ? user?.categoryId.name : 'Select a Category'}
                        </option>
                        {categoriesData
                          ? categoriesData.map((category) => (
                              <option key={category._id} value={category._id} className="option">
                                {category.name}
                              </option>
                            ))
                          : 'Loding Categories'}
                      </select>
                    </div>
                  </div>

                  {/* City */}
                  <div className="select__wrapper">
                    <label className="label" htmlFor="cdropdown">
                      City
                    </label>
                    <div className="arrow">
                      <select
                        name="cityId"
                        id="cdropdown"
                        value={formData.cityId || ''}
                        onChange={handleChange}
                        className="select"
                      >
                        <option value={user?.cityId ? user?.cityId : ''} className="option__title">
                          {user?.cityId ? user?.cityId.name : 'Select a City'}
                        </option>
                        {citiesData
                          ? citiesData.map((city) => (
                              <option key={city._id} value={city._id} className="option">
                                {city.name}
                              </option>
                            ))
                          : 'Loding Cities'}
                      </select>
                    </div>
                  </div>

                  {/* Images */}
                  <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                    <label
                      htmlFor="pro"
                      style={{
                        marginTop: '15px',
                        marginBottom: '10px',
                        fontSize: '22px',
                        fontWeight: '600',
                        color: '#111927',
                      }}
                    >
                      Upload the profile
                    </label>
                    <input
                      accept="image/*"
                      id="pro"
                      type="file"
                      name="profile"
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '12px' }}>
                    <label
                      htmlFor="back"
                      style={{
                        marginTop: '15px',
                        marginBottom: '10px',
                        fontSize: '22px',
                        fontWeight: '600',
                        color: '#111927',
                      }}
                    >
                      Upload the background
                    </label>
                    <input
                      accept="image/*"
                      type="file"
                      id="back"
                      name="background"
                      onChange={handleBackgroundChange}
                    />
                  </div>
                </div>
                {/* Platforms */}
                <div className={styles.platfroms}>
                  <h2 className={styles.input__title} style={{ fontSize: '22px' }}>
                    Platforms
                  </h2>
                  {loading ? (
                    <LoadingSection padding={'15px'} />
                  ) : platformsData && platformsData?.length !== 0 && !loading ? (
                    platformsData.map((platform, index) => (
                      <React.Fragment key={index}>
                        <h4 style={{ fontSize: '17px', margin: '15px 0 -8px' }}>
                          {platform?.name}
                        </h4>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '15px',
                          }}
                          className={styles.platfroms__inputs}
                        >
                          <TextField
                            label={`${platform.name} Link`}
                            type="text"
                            name={`${platform._id}_link`} // Use a unique name for each link field
                            onChange={(e) => handlePlatformsLinkChange(e, platform)}
                            fullWidth
                            placeholder={`Link`}
                            style={{ marginTop: '15px', marginBottom: '0px', width: '50%' }}
                            className={styles.platfrom__input}
                          />
                          <TextField
                            key={platform._id}
                            label={`${platform.name} Followers`}
                            type="number"
                            name={platform._id}
                            onChange={(e) => handlePlatformsChange(e, platform)}
                            fullWidth
                            placeholder={`Number of followers`}
                            style={{ marginTop: '15px', marginBottom: '0px', width: '50%' }}
                            className={styles.platfrom__input}
                          />
                        </div>
                      </React.Fragment>
                    ))
                  ) : null}
                </div>
              </div>
              {/* Submit Button */}
              <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  type="submit"
                  style={{
                    backgroundColor: 'var(--second-blue)',
                    color: 'white',
                    marginTop: '30px',
                    fontSize: '16px',
                    borderRadius: '30px',
                    paddingRight: '25px',
                    paddingLeft: '25px',
                  }}
                >
                  Update Info
                </Button>
              </div>
            </form>
          </Box>
        </Container>
      </Box>
    </>
  )
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
export default Page
