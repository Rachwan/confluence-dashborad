import { useCallback, useMemo, useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";

import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { AllCollaborationsTable } from "src/sections/allCollaborations/allCollaborations-table";
import { AllCollaborationsSearch } from "src/sections/allCollaborations/allCollaborations-search";
import { applyPagination } from "src/utils/apply-pagination";
import Link from "next/link";

const Page = () => {
  const [allCollaborationsData, setAllCollaborationsData] = useState([]);

  const fetchAllCollaborationsData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_END}/collaboration/all`);
      setAllCollaborationsData(response.data);
      console.log("response.data:", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllCollaborationsData();
  }, []);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const useAllCollaborations = (page, rowsPerPage) => {
    return useMemo(() => {
      return applyPagination(allCollaborationsData, page, rowsPerPage);
    }, [allCollaborationsData, page, rowsPerPage]);
  };

  const useAllCollaborationsIds = (allCollaborations) => {
    return useMemo(() => {
      return allCollaborations.map((collaboration) => collaboration.id);
    }, [allCollaborations]);
  };

  const allCollaborationsSelection = useSelection(
    useAllCollaborationsIds(useAllCollaborations(page, rowsPerPage))
  );

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  return (
    <>
      <Head>
        <title>All Collaborations | Confluence</title>
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
                <Typography variant="h4">All Collaborations</Typography>
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
              <Link href="/addCollaboration" target="_blank">
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
                  Add a Collaboration
                </Button>
              </Link>
            </Stack>
            <AllCollaborationsSearch />
            <AllCollaborationsTable
              count={allCollaborationsData.length}
              items={useAllCollaborations(page, rowsPerPage)}
              onDeselectAll={allCollaborationsSelection.handleDeselectAll}
              onDeselectOne={allCollaborationsSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={allCollaborationsSelection.handleSelectAll}
              onSelectOne={allCollaborationsSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={allCollaborationsSelection.selected}
              fetchUpdatedData={fetchAllCollaborationsData}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
