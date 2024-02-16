import PropTypes from "prop-types";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Avatar,
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";
import { useState } from "react";
// import EditInfluencerForm from "./influencers-edit-form";

export const InfluencersTable = (props) => {
  // const [isInfluencerFormOpen, setIsInfluencerFormOpen] = useState(false);
  // const [selectedInfluencer, setSelectedInfluencer] = useState(null);

  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    fetchUpdatedData,
  } = props;

  // const handleEditClick = (infleuncer) => {
  //   setIsInfluencerFormOpen(true);
  //   setSelectedInfluencer(infleuncer);
  // };

  const handleDeleteClick = async (infleuncer) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF0000",
      cancelButtonColor: "#00306e",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${process.env.NEXT_PUBLIC_BACK_END}/user/${infleuncer._id}`);
          fetchUpdatedData();

          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
          onClose();
        } catch (error) {
          console.error("Error deleting infleuncers:", error);
        }
      }
    });
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 2000 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontSize: "14px" }}>Id</TableCell>
                <TableCell style={{ fontSize: "14px" }}>Name</TableCell>
                <TableCell style={{ fontSize: "14px" }}>Email</TableCell>
                <TableCell style={{ fontSize: "14px" }}>Background</TableCell>
                <TableCell style={{ fontSize: "14px" }}>Number</TableCell>
                <TableCell style={{ fontSize: "14px" }}>Age</TableCell>
                <TableCell style={{ fontSize: "14px" }}>City</TableCell>
                <TableCell style={{ fontSize: "14px" }}>Platforms</TableCell>
                <TableCell style={{ fontSize: "14px" }}>Category</TableCell>
                <TableCell style={{ fontSize: "14px" }}>Created At</TableCell>
                <TableCell style={{ fontSize: "14px" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((influencer) => {
                const isSelected = selected.includes(influencer._id);
                const createdAt = influencer.createdAt;
                const formattedDate = new Date(createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });

                return (
                  <TableRow hover key={influencer._id} selected={isSelected}>
                    <TableCell style={{ fontSize: "16px" }}>{influencer._id}</TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar
                          src={`${process.env.NEXT_PUBLIC_BACK_END}/${influencer.profile}`}
                          style={{ fontSize: "16px", width: "60px", height: "60px" }}
                        >
                          {getInitials(influencer.name)}
                        </Avatar>
                        <Typography variant="subtitle2" style={{ fontSize: "16px" }}>
                          {influencer.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell style={{ fontSize: "16px" }}>{influencer.email}</TableCell>
                    <TableCell>
                      <img
                        src={`${process.env.NEXT_PUBLIC_BACK_END}/${influencer.background}`}
                        alt=""
                        style={{ maxWidth: "125px", maxHeight: "200px" }}
                      />
                    </TableCell>
                    <TableCell style={{ fontSize: "16px" }}>{influencer.number}</TableCell>
                    <TableCell style={{ fontSize: "16px" }}>{influencer.age}</TableCell>
                    <TableCell style={{ fontSize: "16px" }}>
                      {influencer.cityId?.name || "No City Yet"}
                    </TableCell>
                    <TableCell style={{ fontSize: "16px" }}>
                      <ul>
                        {influencer.platforms.map((platform) => (
                          <li key={platform.platformId._id}>
                            <p
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "5px",
                              }}
                            >
                              <img
                                style={{ width: "20px", height: "20px", display: "flex" }}
                                src={`${process.env.NEXT_PUBLIC_BACK_END}/${platform.platformId.icon}`}
                                alt=""
                              />
                              : {platform.followers}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell style={{ fontSize: "16px" }}>
                      {influencer.categoryId?.name || "No Category Yet"}
                    </TableCell>
                    <TableCell style={{ fontSize: "16px" }}>{formattedDate}</TableCell>
                    <TableCell>
                      <div style={{ position: "relative", left: "20px", width: "fit-content" }}>
                        {/* <div
                          onClick={() => handleEditClick(influencer)}
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            src="/assets/icons/pen-to-square-solid (1).svg"
                            style={{ width: "22px" }}
                            alt=""
                          />
                        </div> */}
                        <div
                          onClick={() => handleDeleteClick(influencer)}
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            src="/assets/icons/trash-can-solid.svg"
                            style={{ width: "20px" }}
                            alt=""
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            {/* <section>
              {isInfluencerFormOpen && (
                <EditInfluencerForm
                  Influencer={selectedInfluencer}
                  onClose={() => setIsInfluencerFormOpen(false)}
                  fetchUpdatedData={fetchUpdatedData}
                />
              )}
            </section> */}
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

InfluencersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
