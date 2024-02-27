import PropTypes from "prop-types";
import axios from "axios";
import Link from "next/link";
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
import EditMyCollaborationForm from "./myCollaborations-edit-form";

export const MyCollaborationsTable = (props) => {
  const [isMyCollaborationFormOpen, setIsMyCollaborationFormOpen] = useState(false);
  const [selectedMyCollaboration, setSelectedMyCollaboration] = useState(null);

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

  console.log("here", items, items.length);

  const handleEditClick = (myCollaboration) => {
    setIsMyCollaborationFormOpen(true);
    setSelectedMyCollaboration(myCollaboration);
  };

  const handleDeleteClick = async (myCollaboration) => {
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
            `${process.env.NEXT_PUBLIC_BACK_END}/collaboration/${myCollaboration._id}`
          );
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
        <Box sx={{ minWidth: 3000 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontSize: "14px" }}>Id</TableCell>
                {/* <TableCell style={{ fontSize: "14px" }}>Link</TableCell> */}
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
              {items.length === 0 ? (
                <TableRow>
                  <TableCell style={{ fontSize: "18px", fontWeight: "500" }}>
                    There is no collabs yet!
                  </TableCell>
                </TableRow>
              ) : (
                items.map((myCollaboration) => {
                  const isSelected = selected.includes(myCollaboration._id);
                  const createdAt = myCollaboration.createdAt;
                  const formattedDate = new Date(createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });

                  return (
                    <TableRow hover key={myCollaboration._id} selected={isSelected}>
                      <TableCell style={{ fontSize: "16px" }}>{myCollaboration._id}</TableCell>
                      {/* <TableCell style={{ fontSize: "16px" }}>
                        <Link href={"/"} style={{ textDecoration: "underline" }}>
                          Page Link
                        </Link>
                      </TableCell> */}
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          <Typography variant="subtitle2" style={{ fontSize: "16px" }}>
                            {myCollaboration.title}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACK_END}/${myCollaboration.background}`}
                          alt=""
                          style={{ maxWidth: "125px", maxHeight: "200px" }}
                        />
                      </TableCell>
                      <TableCell style={{ fontSize: "16px" }}>
                        {myCollaboration.description}
                      </TableCell>
                      <TableCell style={{ fontSize: "16px" }}>
                        <ul>
                          {myCollaboration.platforms.map((platform) => (
                            <li key={platform._id}>
                              <p>{platform}</p>
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell style={{ fontSize: "16px" }}>
                        {myCollaboration.singleTitle}
                      </TableCell>
                      <TableCell style={{ fontSize: "16px" }}>
                        <ul
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                          }}
                        >
                          {/* {console.log("myCollaboration.images", myCollaboration.images)} */}
                          {/* {myCollaboration.images.map((img, index) => (
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
                        ))} */}
                          <li>
                            <img
                              src={`${process.env.NEXT_PUBLIC_BACK_END}/${myCollaboration.firstImage}`}
                              alt=""
                              style={{
                                maxWidth: "200px",
                                maxHeight: "200px",
                                boxShadow: "7px 7px 30px rgba(0, 0, 0, 0.3)",
                              }}
                            />
                          </li>
                          <li>
                            <img
                              src={`${process.env.NEXT_PUBLIC_BACK_END}/${myCollaboration.secondImage}`}
                              alt=""
                              style={{
                                maxWidth: "200px",
                                maxHeight: "200px",
                                boxShadow: "7px 7px 30px rgba(0, 0, 0, 0.3)",
                              }}
                            />
                          </li>
                          <li>
                            <img
                              src={`${process.env.NEXT_PUBLIC_BACK_END}/${myCollaboration.thirdImage}`}
                              alt=""
                              style={{
                                maxWidth: "200px",
                                maxHeight: "200px",
                                boxShadow: "7px 7px 30px rgba(0, 0, 0, 0.3)",
                              }}
                            />
                          </li>
                          <li>
                            <img
                              src={`${process.env.NEXT_PUBLIC_BACK_END}/${myCollaboration.fourthImage}`}
                              alt=""
                              style={{
                                maxWidth: "200px",
                                maxHeight: "200px",
                                boxShadow: "7px 7px 30px rgba(0, 0, 0, 0.3)",
                              }}
                            />
                          </li>
                        </ul>
                      </TableCell>
                      <TableCell style={{ fontSize: "16px" }}>
                        <ul>
                          {myCollaboration.additional.map((singleAdditional) => (
                            <li key={myCollaboration._id}>
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
                            onClick={() => handleEditClick(myCollaboration)}
                            style={{ cursor: "pointer" }}
                          >
                            <img
                              src="/assets/icons/pen-to-square-solid (1).svg"
                              style={{ width: "22px" }}
                              alt=""
                            />
                          </div>
                          <div
                            onClick={() => handleDeleteClick(myCollaboration)}
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
                })
              )}
            </TableBody>
            <section>
              {isMyCollaborationFormOpen && (
                <EditMyCollaborationForm
                  myCollaboration={selectedMyCollaboration}
                  onClose={() => setIsMyCollaborationFormOpen(false)}
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

MyCollaborationsTable.propTypes = {
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
