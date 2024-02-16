import PropTypes from "prop-types";
import axios from "axios";
import Swal from "sweetalert2";
import {
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
import { useState } from "react";
import EditAllCollaborationForm from "./allCollaborations-edit-form";

export const AllCollaborationsTable = (props) => {
  const [isAllCollaborationFormOpen, setIsAllCollaborationFormOpen] = useState(false);
  const [selectedAllCollaboration, setSelectedAllCollaboration] = useState(null);

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

  const handleEditClick = (allCollaboration) => {
    console.log("allCollaboration line 35:", allCollaboration);
    setIsAllCollaborationFormOpen(true);
    setSelectedAllCollaboration(allCollaboration);
    console.log("worked");
  };

  const handleDeleteClick = async (allCollaboration) => {
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
          await axios.delete(
            `${process.env.NEXT_PUBLIC_BACK_END}/collaboration/${allCollaboration._id}`
          );
          fetchUpdatedData();

          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
          onClose();
        } catch (error) {
          console.error("Error deleting collaboration:", error);
        }
      }
    });
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 4000 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontSize: "14px" }}>Collaboration Id</TableCell>
                <TableCell style={{ fontSize: "14px" }}>User Name</TableCell>
                <TableCell style={{ fontSize: "14px" }}>User Id</TableCell>
                <TableCell style={{ fontSize: "14px" }}>Title</TableCell>
                <TableCell style={{ fontSize: "14px" }}>Background</TableCell>
                <TableCell style={{ fontSize: "14px" }}>description</TableCell>
                <TableCell style={{ fontSize: "14px" }}>Platforms</TableCell>
                <TableCell style={{ fontSize: "14px" }}>singleTitle</TableCell>
                <TableCell style={{ fontSize: "14px" }}>Images</TableCell>
                <TableCell style={{ fontSize: "14px" }}>Additional</TableCell>
                <TableCell style={{ fontSize: "14px" }}>Created At</TableCell>
                <TableCell style={{ fontSize: "14px" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((allCollaboration) => {
                const isSelected = selected.includes(allCollaboration._id);
                const createdAt = allCollaboration.createdAt;
                const formattedDate = new Date(createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });

                return (
                  <TableRow hover key={allCollaboration._id} selected={isSelected}>
                    <TableCell style={{ fontSize: "16px" }}>{allCollaboration._id}</TableCell>
                    <TableCell style={{ fontSize: "16px" }}>
                      {allCollaboration.userId ? allCollaboration.userId.name : "NNNN/AAAA"}
                    </TableCell>
                    <TableCell style={{ fontSize: "16px" }}>
                      {allCollaboration.userId ? allCollaboration.userId._id : "NNNN/AAAA"}
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography variant="subtitle2" style={{ fontSize: "16px" }}>
                          {allCollaboration.title}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <img
                        src={`${process.env.NEXT_PUBLIC_BACK_END}/${allCollaboration.background}`}
                        alt=""
                        style={{ maxWidth: "125px", maxHeight: "200px" }}
                      />
                    </TableCell>
                    <TableCell style={{ fontSize: "16px" }}>
                      {allCollaboration.description}
                    </TableCell>
                    <TableCell style={{ fontSize: "16px" }}>
                      <ul>
                        {allCollaboration.platforms.map((platform) => (
                          <li key={platform._id}>
                            <p>{platform}</p>
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell style={{ fontSize: "16px" }}>
                      {allCollaboration.singleTitle}
                    </TableCell>
                    <TableCell style={{ fontSize: "16px" }}>
                      <ul
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "20px",
                        }}
                      >
                        {allCollaboration.images.map((img, index) => (
                          <li key={index}>
                            <img
                              src={`${process.env.NEXT_PUBLIC_BACK_END}/${img}`}
                              style={{
                                maxWidth: "200px",
                                maxHeight: "200px",
                                boxShadow: "7px 7px 30px rgba(0, 0, 0, 0.3)",
                              }}
                              alt=""
                            />
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell style={{ fontSize: "16px" }}>
                      <ul>
                        {allCollaboration.additional.map((singleAdditional, index) => (
                          <li key={index}>
                            <p
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                gap: "1px",
                              }}
                            >
                              {singleAdditional.name}: {singleAdditional.detail}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell style={{ fontSize: "16px" }}>{formattedDate}</TableCell>
                    <TableCell>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <div
                          onClick={() => handleEditClick(allCollaboration)}
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            src="/assets/icons/pen-to-square-solid (1).svg"
                            style={{ width: "22px" }}
                            alt=""
                          />
                        </div>
                        <div
                          onClick={() => handleDeleteClick(allCollaboration)}
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
            <section>
              {isAllCollaborationFormOpen && (
                <EditAllCollaborationForm
                  allCollaboration={selectedAllCollaboration}
                  onClose={() => setIsAllCollaborationFormOpen(false)}
                  fetchUpdatedData={fetchUpdatedData}
                />
              )}
            </section>
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

AllCollaborationsTable.propTypes = {
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
