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
import EditCategoryForm from "./categories-edit-form";
import LoadingSection from "src/components/LoadingSection";

export const CategoriesTable = (props) => {
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    fetchUpdatedData,
    loading,
  } = props;

  const handleEditClick = (category) => {
    setIsCategoryFormOpen(true);
    setSelectedCategory(category);
  };

  const handleDeleteClick = async (category) => {
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
          await axios.delete(`${process.env.NEXT_PUBLIC_BACK_END}/category/${category._id}`);
          fetchUpdatedData();

          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
          onClose();
        } catch (error) {
          console.error("Error deleting category:", error);
        }
      }
    });
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontSize: "14px" }}>Id</TableCell>
                <TableCell style={{ fontSize: "14px" }}>Icon & Name</TableCell>
                <TableCell style={{ fontSize: "14px" }}>background</TableCell>
                <TableCell style={{ fontSize: "14px" }}>Active color</TableCell>
                <TableCell style={{ fontSize: "14px" }}>Created At</TableCell>
                <TableCell style={{ fontSize: "14px" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <LoadingSection padding={"50px"} />
              ) : items && items.length === 0 && !loading ? (
                <TableRow>
                  <TableCell style={{ fontSize: "18px", fontWeight: "500", padding: "50px" }}>
                    There is no categories yet for no reason!
                  </TableCell>
                </TableRow>
              ) : (
                items.map((category) => {
                  const isSelected = selected.includes(category._id);
                  const createdAt = category.createdAt;
                  const formattedDate = new Date(createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });

                  return (
                    <TableRow hover key={category._id} selected={isSelected}>
                      <TableCell style={{ fontSize: "16px" }}>{category._id}</TableCell>
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          <img
                            src={`${process.env.NEXT_PUBLIC_BACK_END}/${category.icon}`}
                            style={{ fontSize: "16px", width: "40px", height: "40px" }}
                          />
                          <Typography variant="subtitle2" style={{ fontSize: "16px" }}>
                            {category.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACK_END}/${category.background}`}
                          alt=""
                          style={{ maxWidth: "125px", maxHeight: "200px" }}
                        />
                      </TableCell>
                      <TableCell style={{ fontSize: "16px" }}>{category.activeColor}</TableCell>
                      <TableCell style={{ fontSize: "16px" }}>{formattedDate}</TableCell>
                      <TableCell>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <div
                            onClick={() => handleEditClick(category)}
                            style={{ cursor: "pointer" }}
                          >
                            <img
                              src="/assets/icons/pen-to-square-solid (1).svg"
                              style={{ width: "22px" }}
                              alt=""
                            />
                          </div>
                          <div
                            onClick={() => handleDeleteClick(category)}
                            style={{ cursor: "pointer" }}
                          >
                            {/* <DeleteIcon /> */}
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
              {isCategoryFormOpen && (
                <EditCategoryForm
                  category={selectedCategory}
                  onClose={() => setIsCategoryFormOpen(false)}
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

CategoriesTable.propTypes = {
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
