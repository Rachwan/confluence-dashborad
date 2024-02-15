import React, { useState, useEffect } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2";

const InfluencerAddForm = ({ onClose, fetchUpdatedData }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
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
      console.log(response.data);
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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_END}/user/add/influencer`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchUpdatedData();

      Swal.fire({
        title: "Done",
        text: `${response.data.name} Add it successfully!`,
        icon: "success",
      });

      onClose();
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
    <Dialog open={true} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          width: 400,
          backgroundColor: "#fff",
          borderRadius: "4px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ color: "var(--second-blue)", fontSize: "25px" }}>Influencer Details</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            placeholder="Influencer name"
            style={{ fontSize: "20px" }}
          />
          <TextField
            label="Email"
            type="email"
            name="email"
            onChange={handleChange}
            fullWidth
            margin="normal"
            placeholder="Influencer email"
            style={{ fontSize: "20px" }}
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            onChange={handleChange}
            fullWidth
            margin="normal"
            placeholder="Influencer password"
            style={{ fontSize: "20px" }}
          />
          <TextField
            label="Age"
            type="text"
            name="age"
            onChange={handleChange}
            fullWidth
            margin="normal"
            placeholder="Influencer age"
            style={{ fontSize: "20px" }}
          />
          <TextField
            label="Phone"
            type="text"
            name="number"
            onChange={handleChange}
            fullWidth
            margin="normal"
            placeholder="Influencer number"
            style={{ fontSize: "20px" }}
          />

          {/* Category */}
          <div className="select__wrapper">
            <label className="label" htmlFor="dropdown">
              Category
            </label>
            <div className="arrow">
              <select className="select" name="categoryId" id="dropdown" onChange={handleChange}>
                <option value="" className="option__title">
                  Select a Category
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
              <select className="select" name="cityId" id="cdropdown" onChange={handleChange}>
                <option value="" className="option__title">
                  Select a City
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

          {/* Platforms */}
          <div>
            <label htmlFor="pdropdown">Platforms</label>
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
                      margin="normal"
                      placeholder={`Number of followers`}
                      style={{ fontSize: "20px" }}
                    />
                  </>
                ))
              : "Loading Platforms"}
          </div>

          {/* Images */}
          <div style={{ display: "flex", flexDirection: "column", marginBottom: "20px" }}>
            <label
              htmlFor="pro"
              style={{ marginTop: "15px", marginBottom: "10px", fontSize: "20px" }}
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
              style={{ marginTop: "15px", marginBottom: "10px", fontSize: "20px" }}
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

          <Button
            variant="contained"
            type="submit"
            style={{
              backgroundColor: "var(--second-blue)",
              color: "white",
              marginTop: "30px",
              fontSize: "16px",
              width: "100%",
              borderRadius: "30px",
            }}
          >
            Add Influencer
          </Button>
        </form>
      </Box>
    </Dialog>
  );
};

export default InfluencerAddForm;
