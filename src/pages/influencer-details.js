import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2";
import { UserContext } from "src/contexts/UserContext";
import styles from "../../styles/influencer-details.module.css";

const Page = () => {
  const { user, setUser, fetchUserData } = useContext(UserContext);
  const [formData, setFormData] = useState({
    age: "",
    number: "",
    platforms: [],
    profile: null,
    background: null,
    cityId: "",
    categoryId: "",
  });

  /* Fethcing neccessary data */
  const [categoriesData, setCategoriesData] = useState([]);

  const fetchCategoriesData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_END}/category/all`);
      setCategoriesData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  /* */

  const [platformsData, setPlatformsData] = useState([]);

  const fetchPlatformsData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_END}/platform/all`);
      setPlatformsData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPlatformsData();
  }, []);

  /* */

  const [citiesData, setCitiesData] = useState([]);

  const fetchCitiesData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_END}/city/all`);
      setCitiesData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCitiesData();
  }, []);

  /* Fetching ends here */

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePlatformsChange = (e, thePlatform) => {
    const { name, value } = e.target;

    const existingPlatform = formData.platforms.find(
      (platform) => platform.platformId === thePlatform._id
    );

    const updatedPlatforms = formData.platforms.map((platform) =>
      platform.platformId === thePlatform._id ? { ...platform, followers: value } : platform
    );

    if (!existingPlatform) {
      updatedPlatforms.push({
        platformId: thePlatform._id,
        followers: value,
      });
    }

    setFormData((prevData) => ({
      ...prevData,
      platforms: updatedPlatforms,
    }));
  };

  const handleProfileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      profile: e.target.files[0],
    }));
  };

  const handleBackgroundChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      background: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_END}/user/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await fetchUserData();
      setFormData({});
      Swal.fire({
        title: "Done",
        text: `${response.data.name}, your info updated successfully!`,
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Try again.",
      });
      console.error("Error adding influencer:", error);
    }
  };

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
              <Stack spacing={1} sx={{ display: "flex" }}>
                <Typography variant="h4">My Details</Typography>
              </Stack>
            </Stack>
          </Stack>
          <Box
            sx={{
              backgroundColor: "#fff",
            }}
          >
            <h2 style={{ color: "var(--second-blue)", fontSize: "17px", margin: "20px 0 30px" }}>
              Please Insert all the details below.
            </h2>
            <form className={styles.form} onSubmit={handleSubmit} encType="multipart/form-data">
              {/* All Inputs */}
              <div className={styles.all__inputs}>
                {/* All Info Besides Platfroms */}
                <div className={styles.inputs}>
                  <h2 className={styles.input__title}>Personal Info</h2>
                  <TextField
                    label="Age"
                    type="text"
                    name="age"
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    placeholder="Insert your age"
                    style={{ marginBottom: "15px" }}
                  />
                  <TextField
                    label="Phone"
                    type="text"
                    name="number"
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    placeholder="Insert your number"
                    style={{ marginTop: "0px", marginBottom: "15px" }}
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
                        value={formData.categoryId || ""}
                        className="select"
                      >
                        <option value="" className="option__title">
                          {user?.categoryId ? user.categoryId.name : "Select a Category"}
                        </option>
                        {categoriesData
                          ? categoriesData.map((category) => (
                              <option key={category._id} value={category._id} className="option">
                                {category.name}
                              </option>
                            ))
                          : "Loding Categories"}
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
                        value={formData.cityId || ""}
                        onChange={handleChange}
                        className="select"
                      >
                        <option value="" className="option__title">
                          {user?.cityId ? user.cityId.name : "Select a City"}
                        </option>
                        {citiesData
                          ? citiesData.map((city) => (
                              <option key={city._id} value={city._id} className="option">
                                {city.name}
                              </option>
                            ))
                          : "Loding Cities"}
                      </select>
                    </div>
                  </div>

                  {/* Images */}
                  <div style={{ display: "flex", flexDirection: "column", marginBottom: "20px" }}>
                    <label
                      htmlFor="pro"
                      style={{
                        marginTop: "15px",
                        marginBottom: "10px",
                        fontSize: "20px",
                        fontWeight: "500",
                        color: "#111927",
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
                  <div style={{ display: "flex", flexDirection: "column", marginBottom: "12px" }}>
                    <label
                      htmlFor="back"
                      style={{
                        marginTop: "15px",
                        marginBottom: "10px",
                        fontSize: "20px",
                        fontWeight: "500",
                        color: "#111927",
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
                  <h2 className={styles.input__title}>Platforms</h2>
                  {platformsData
                    ? platformsData.map((platform, index) => (
                        <>
                          <TextField
                            key={platform._id}
                            label={`${platform.name}`}
                            type="number"
                            name={platform._id}
                            onChange={(e) => handlePlatformsChange(e, platform)}
                            fullWidth
                            placeholder={`Number of followers`}
                            style={{ marginTop: "15px", marginBottom: "0px" }}
                          />
                        </>
                      ))
                    : "Loading Platforms"}
                </div>
              </div>
              {/* Submit Button */}
              <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  type="submit"
                  style={{
                    backgroundColor: "var(--second-blue)",
                    color: "white",
                    marginTop: "30px",
                    fontSize: "16px",
                    borderRadius: "30px",
                    paddingRight: "25px",
                    paddingLeft: "25px",
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
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
