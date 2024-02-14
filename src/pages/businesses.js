import { useCallback, useMemo, useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";

import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { BusinessesTable } from "src/sections/businesses/businesses-table";
import { BusinessesSearch } from "src/sections/businesses/businesses-search";
import { applyPagination } from "src/utils/apply-pagination";
import BusinessAddForm from "src/sections/businesses/businesses-add-form";

const Page = () => {
  const [businessesData, setBusinessesData] = useState([]);

  const fetchBusinessesData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_END}/user/get/business`);
      setBusinessesData(response.data);
      console.log("response.data:", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBusinessesData();
  }, []);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const useBusinesses = (page, rowsPerPage) => {
    return useMemo(() => {
      return applyPagination(businessesData, page, rowsPerPage);
    }, [businessesData, page, rowsPerPage]);
  };

  const useBusinessesIds = (businesses) => {
    return useMemo(() => {
      return businesses.map((business) => business.id);
    }, [businesses]);
  };

  const businessesSelection = useSelection(useBusinessesIds(useBusinesses(page, rowsPerPage)));

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
        <title>Businesses | Confluence</title>
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
                <Typography variant="h4">Businesses</Typography>
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
                  Add Business
                </Button>
              </div>
            </Stack>
            <BusinessesSearch />
            <BusinessesTable
              count={businessesData.length}
              items={useBusinesses(page, rowsPerPage)}
              onDeselectAll={businessesSelection.handleDeselectAll}
              onDeselectOne={businessesSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={businessesSelection.handleSelectAll}
              onSelectOne={businessesSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={businessesSelection.selected}
              fetchUpdatedData={fetchBusinessesData}
            />
          </Stack>
        </Container>
        <section>
          {isAddFormOpen && (
            <BusinessAddForm onClose={handleAddFormClose} fetchUpdatedData={fetchBusinessesData} />
          )}
        </section>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
