import { useCallback, useMemo, useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";

import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CategoriesTable } from "src/sections/categories/categories-table";
import { CategoriesSearch } from "src/sections/categories/categories-search";
import { applyPagination } from "src/utils/apply-pagination";
import CategoryAddForm from "src/sections/categories/categories-add-form";

const Page = () => {
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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const useCategories = (page, rowsPerPage) => {
    return useMemo(() => {
      return applyPagination(categoriesData, page, rowsPerPage);
    }, [categoriesData, page, rowsPerPage]);
  };

  const useCategoriesIds = (categories) => {
    return useMemo(() => {
      return categories.map((category) => category.id);
    }, [categories]);
  };

  const categoriesSelection = useSelection(useCategoriesIds(useCategories(page, rowsPerPage)));

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const handleAddClick = () => {
    setIsAddFormOpen(true);
  };

  const handleAddFormClose = () => {
    setIsAddFormOpen(false);
  };

  return (
    <>
      <Head>
        <title>Categories | Confluence</title>
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
              <Stack spacing={1}>
                <Typography variant="h4">Categories</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    }
                    style={{ fontSize: "16px" }}
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                    style={{ fontSize: "16px" }}
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
              <div onClick={handleAddClick}>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  style={{
                    fontSize: "16px",
                    backgroundColor: "var(--second-blue)",
                    borderRadius: "30px",
                  }}
                  variant="contained"
                >
                  Add Category
                </Button>
              </div>
            </Stack>
            <CategoriesSearch />
            <CategoriesTable
              count={categoriesData.length}
              items={useCategories(page, rowsPerPage)}
              onDeselectAll={categoriesData.handleDeselectAll}
              onDeselectOne={categoriesData.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={categoriesData.handleSelectAll}
              onSelectOne={categoriesData.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={categoriesData.selected}
              fetchUpdatedData={fetchCategoriesData}
            />
          </Stack>
        </Container>
        <section>
          {isAddFormOpen && (
            <CategoryAddForm onClose={handleAddFormClose} fetchUpdatedData={fetchCategoriesData} />
          )}
        </section>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
