import { useCallback, useMemo, useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";

import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { InfluencersTable } from "src/sections/influencers/influencers-table";
import { InfluencersSearch } from "src/sections/influencers/influencers-search";
import { applyPagination } from "src/utils/apply-pagination";
import InfluencerAddForm from "src/sections/influencers/influencers-add-form";

const Page = () => {
  const [influencersData, setinfluencersData] = useState([]);

  const fetchinfluencersData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_END}/user/get/influencer`
      );
      setinfluencersData(response.data);
      console.log("response.data:", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchinfluencersData();
  }, []);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const useInfluencers = (page, rowsPerPage) => {
    return useMemo(() => {
      return applyPagination(influencersData, page, rowsPerPage);
    }, [influencersData, page, rowsPerPage]);
  };

  const useInfluencersIds = (influencers) => {
    return useMemo(() => {
      return influencers.map((infleuncer) => infleuncer.id);
    }, [influencers]);
  };

  const influencersSelection = useSelection(useInfluencersIds(useInfluencers(page, rowsPerPage)));

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
        <title>Influencers | Confluence</title>
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
                <Typography variant="h4">Influencers</Typography>
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
                  Add Influencer
                </Button>
              </div>
            </Stack>
            <InfluencersSearch />
            <InfluencersTable
              count={influencersData.length}
              items={useInfluencers(page, rowsPerPage)}
              onDeselectAll={influencersSelection.handleDeselectAll}
              onDeselectOne={influencersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={influencersSelection.handleSelectAll}
              onSelectOne={influencersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={influencersSelection.selected}
              fetchUpdatedData={fetchinfluencersData}
            />
          </Stack>
        </Container>
        <section>
          {isAddFormOpen && (
            <InfluencerAddForm
              onClose={handleAddFormClose}
              fetchUpdatedData={fetchinfluencersData}
            />
          )}
        </section>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
