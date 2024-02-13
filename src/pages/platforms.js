import { useCallback, useMemo, useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import { subDays, subHours } from "date-fns";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";

import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { PlatformsTable } from "src/sections/platforms/platforms-table";
import { PlatformsSearch } from "src/sections/platforms/platforms-search";
import { applyPagination } from "src/utils/apply-pagination";

const now = new Date();

const Page = () => {
  const [platformsData, setPlatformsData] = useState([]);

  useEffect(() => {
    const fetchPlatformsData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_END}/platform/all`);
        setPlatformsData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlatformsData();
  }, []);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const usePlatforms = (page, rowsPerPage) => {
    return useMemo(() => {
      return applyPagination(platformsData, page, rowsPerPage);
    }, [platformsData, page, rowsPerPage]);
  };

  const usePlatformsIds = (platforms) => {
    return useMemo(() => {
      return platforms.map((platform) => platform.id);
    }, [platforms]);
  };

  const platformsSelection = useSelection(usePlatformsIds(usePlatforms(page, rowsPerPage)));

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  return (
    <>
      <Head>
        <title>Platforms | Confluence</title>
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
                <Typography variant="h4">Platforms</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    }
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
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            <PlatformsSearch />
            <PlatformsTable
              count={platformsData.length}
              items={usePlatforms(page, rowsPerPage)}
              onDeselectAll={platformsSelection.handleDeselectAll}
              onDeselectOne={platformsSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={platformsSelection.handleSelectAll}
              onSelectOne={platformsSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={platformsSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
