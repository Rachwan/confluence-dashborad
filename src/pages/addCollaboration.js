import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "src/contexts/UserContext";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Swal from "sweetalert2";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Head from "next/head";

const Page = () => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    title: "",
    background: null,
    description: "",
    platforms: [],
    singleTitle: "",
    images: [null],
    additional: [],
    userId: user._id,
  });

  /* Platforms */
  const [platformsData, setPlatformsData] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

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

  const handlePlatformChange = (platformName) => {
    setSelectedPlatforms((prevSelected) =>
      prevSelected.includes(platformName)
        ? prevSelected.filter((id) => id !== platformName)
        : [...prevSelected, platformName]
    );
    setFormData((prevData) => ({
      ...prevData,
      platforms: selectedPlatforms,
    }));
  };
  /* --------------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 4 Images baby
  const [selectedImages, setSelectedImages] = useState(Array(4).fill(null));

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    const newImages = [...selectedImages];
    newImages[index] = file;
    setSelectedImages(newImages);

    setFormData((prevData) => ({
      ...prevData,
      images: newImages, // Use the latest state value
    }));
  };
  // ----------------

  /* Additionals */
  const [additionalItems, setAdditionalItems] = useState([{ name: "", detail: "" }]);

  const handleInputChange = (index, field, value) => {
    const newItems = [...additionalItems];
    newItems[index][field] = value;
    setAdditionalItems(newItems);

    setFormData((prevData) => ({
      ...prevData,
      additional: additionalItems,
    }));
  };

  const handleAddItem = () => {
    setAdditionalItems([...additionalItems, { name: "", detail: "" }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...additionalItems];
    newItems.splice(index, 1);
    setAdditionalItems(newItems);
  };

  /* ---------- */
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
        `${process.env.NEXT_PUBLIC_BACK_END}/collaboration/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response) {
        Swal.fire({
          title: "Done",
          text: `Collaboration added it successfully!`,
          icon: "success",
        });
      }
      console.log(formData);
    } catch (error) {
      console.log(formData);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Try again.",
      });
      console.error("Error editing the collaboration:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Add Collaboration | Confluence</title>
      </Head>
      <Box
        sx={{
          p: 4,
          backgroundColor: "#fff",
          width: "100% !important",
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1} sx={{ display: "flex" }}>
                <Typography variant="h4">Add A Collaboration</Typography>
              </Stack>
            </Stack>
          </Stack>
          <Box
            sx={{
              backgroundColor: "#fff",
              width: "100%",
            }}
          >
            <h2 style={{ color: "var(--second-blue)", fontSize: "17px", margin: "20px 0 30px" }}>
              Please Insert all the details below.
            </h2>
            <form style={{ width: "100%" }} enctype="multipart/form-data" onSubmit={handleSubmit}>
              <h2
                style={{
                  fontSize: "20px",
                  marginTop: "20px",
                  marginBottom: "10px",
                  borderBottom: "1px solid var(--second-blue)",
                  paddingBottom: "10px",
                  width: "fit-content",
                }}
              >
                For Collaboration Post:
              </h2>
              <TextField
                label="Title"
                type="text"
                name="title"
                // value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                placeholder="Enter the main title"
              />
              <div style={{ display: "flex", flexDirection: "column", marginBottom: "12px" }}>
                <label
                  htmlFor="back"
                  style={{ fontSize: "20px", margin: "15px 0", fontWeight: "500" }}
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
                label="Description"
                type="text"
                name="description"
                // value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                placeholder="Enter the description"
              />
              {/* Platforms */}
              <div>
                <h1 style={{ fontSize: "20px", margin: "15px 0", fontWeight: "500" }}>
                  Select platforms:
                </h1>
                {platformsData.map((platform) => (
                  <FormControlLabel
                    key={platform._id}
                    control={
                      <Checkbox
                        checked={selectedPlatforms.includes(platform.name)}
                        onChange={() => handlePlatformChange(platform.name)}
                      />
                    }
                    label={platform.name}
                  />
                ))}
              </div>
              <h2
                style={{
                  fontSize: "20px",
                  marginTop: "40px",
                  marginBottom: "10px",
                  borderBottom: "1px solid var(--second-blue)",
                  paddingBottom: "10px",
                  width: "fit-content",
                }}
              >
                For Collaboration Details:
              </h2>
              <TextField
                label="Single Title"
                type="text"
                name="singleTitle"
                // value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                placeholder="Enter the the single title"
              />
              {/* 4 Images */}
              <div>
                <h2 style={{ fontSize: "20px", margin: "15px 0", fontWeight: "500" }}>
                  Update the image you want:
                </h2>
                {selectedImages.map((image, index) => (
                  <div
                    key={index}
                    style={{
                      paddingBottom: "15px",
                      borderBottom: "1px solid var(--second-blue)",
                    }}
                  >
                    <h3 style={{ fontSize: "18px", margin: "15px 0", fontWeight: "500" }}>
                      Image number {index + 1}:
                    </h3>
                    <input
                      style={{
                        width: "100%",
                        marginBottom: "15px",
                      }}
                      accept="image/*"
                      type="file"
                      onChange={(e) => handleImageChange(index, e)}
                    />
                    {image && (
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Selected Image ${index + 1}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div>
                <h2 style={{ fontSize: "20px", margin: "15px 0", fontWeight: "500" }}>
                  Additional Items:
                </h2>
                {additionalItems.map((item, index) => (
                  <div key={index} style={{ marginBottom: "15px" }}>
                    <TextField
                      label="Name"
                      value={item.name}
                      onChange={(e) => handleInputChange(index, "name", e.target.value)}
                      fullWidth
                      placeholder="Enter the the additional name"
                      style={{ marginBottom: "5px" }}
                    />
                    <TextField
                      label="Detail"
                      value={item.detail}
                      onChange={(e) => handleInputChange(index, "detail", e.target.value)}
                      fullWidth
                      placeholder="Enter the the additional delail"
                      style={{ marginBottom: "5px" }}
                    />
                    <div style={{ display: "inline", width: "100%", justifyContent: "flex-end" }}>
                      <Button
                        style={{ textAlign: "right", color: "var(--second-blue)" }}
                        onClick={() => handleRemoveItem(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <div style={{ display: "flex", width: "100%", justifyContent: "flex-start" }}>
                  <Button
                    style={{
                      backgroundColor: "var(--second-blue)",
                      borderRadius: "6px",
                      padding: "5px 10px",
                    }}
                    variant="contained"
                    onClick={handleAddItem}
                  >
                    Add Item
                  </Button>
                </div>
              </div>
              <div style={{ display: "flex", width: "100%", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  type="submit"
                  style={{
                    backgroundColor: "var(--second-blue)",
                    color: "white",
                    marginTop: "30px",
                    fontSize: "16px",
                    borderRadius: "30px",
                  }}
                >
                  Add Collaboration
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
