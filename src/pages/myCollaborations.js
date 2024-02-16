import { useCallback, useMemo, useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "src/contexts/UserContext";
import axios from "axios";
import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";

import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { MyCollaborationsTable } from "src/sections/myCollaborations/myCollaborations-table";
import { MyCollaborationsSearch } from "src/sections/myCollaborations/myCollaborations-search";
import { applyPagination } from "src/utils/apply-pagination";
import Link from "next/link";

const Page = () => {
  const { user } = useContext(UserContext);
  const [myCollaborationsData, setmyCollaborationsData] = useState([]);

  const fetchMyCollaborationsData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_END}/collaboration/usercollaborations/${user._id}`
      );
      setmyCollaborationsData(response.data);
      console.log("collabsssssss", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMyCollaborationsData();
  }, [user]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const useMyCollaborations = (page, rowsPerPage) => {
    return useMemo(() => {
      return applyPagination(myCollaborationsData, page, rowsPerPage);
    }, [myCollaborationsData, page, rowsPerPage]);
  };

  const useMyCollaborationsIds = (MyCollaborations) => {
    return useMemo(() => {
      return MyCollaborations.map((myCollaboration) => myCollaboration.id);
    }, [MyCollaborations]);
  };

  const myCollaborationsSelection = useSelection(
    useMyCollaborationsIds(useMyCollaborations(page, rowsPerPage))
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
        <title>My Collaborations | Confluence</title>
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
                <Typography variant="h4">My Collaborations</Typography>
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
            <MyCollaborationsSearch />
            <MyCollaborationsTable
              count={myCollaborationsData.length}
              items={useMyCollaborations(page, rowsPerPage)}
              onDeselectAll={myCollaborationsSelection.handleDeselectAll}
              onDeselectOne={myCollaborationsSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={myCollaborationsSelection.handleSelectAll}
              onSelectOne={myCollaborationsSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={myCollaborationsSelection.selected}
              fetchUpdatedData={fetchMyCollaborationsData}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;