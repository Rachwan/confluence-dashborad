import { useCallback, useMemo, useState, useEffect } from 'react'
import axios from 'axios'
import Head from 'next/head'
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon'
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon'
import PlusIcon from '@heroicons/react/24/solid/PlusIcon'
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material'
import { useSelection } from 'src/hooks/use-selection'

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import { PlatformsTable } from 'src/sections/platforms/platforms-table'
import { PlatformsSearch } from 'src/sections/platforms/platforms-search'
import { applyPagination } from 'src/utils/apply-pagination'
import PlatformAddForm from 'src/sections/platforms/platforms-add-form'

const Page = () => {
  const [platformsData, setPlatformsData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPlatformsData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_END}/platform/all`)
      setPlatformsData(response.data)
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchPlatformsData()
  }, [])

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const usePlatforms = (page, rowsPerPage) => {
    return useMemo(() => {
      return applyPagination(platformsData, page, rowsPerPage)
    }, [platformsData, page, rowsPerPage])
  }

  const usePlatformsIds = (platforms) => {
    return useMemo(() => {
      return platforms.map((platform) => platform.id)
    }, [platforms])
  }

  const platformsSelection = useSelection(usePlatformsIds(usePlatforms(page, rowsPerPage)))

  const handlePageChange = useCallback((event, value) => {
    setPage(value)
  }, [])

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value)
  }, [])

  const [isAddFormOpen, setIsAddFormOpen] = useState(false)

  const handleAddClick = () => {
    setIsAddFormOpen(true)
  }

  const handleAddFormClose = () => {
    setIsAddFormOpen(false)
  }

  return (
    <>
      <Head>
        <title>Platforms | Confluence</title>
      </Head>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth='xl'>
          <Stack spacing={3}>
            <Stack direction='row' justifyContent='space-between' spacing={4}>
              <Stack spacing={1}>
                <Typography variant='h4'>Platforms</Typography>
                <Stack alignItems='center' direction='row' spacing={1}>
                  <Button
                    color='inherit'
                    startIcon={
                      <SvgIcon fontSize='small'>
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    }
                    style={{ fontSize: '16px' }}
                  >
                    Import
                  </Button>
                  <Button
                    color='inherit'
                    startIcon={
                      <SvgIcon fontSize='small'>
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                    style={{ fontSize: '16px' }}
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
              <div onClick={handleAddClick}>
                <Button
                  startIcon={
                    <SvgIcon fontSize='small'>
                      <PlusIcon />
                    </SvgIcon>
                  }
                  style={{
                    fontSize: '16px',
                    backgroundColor: 'var(--second-blue)',
                    borderRadius: '30px',
                  }}
                  variant='contained'
                >
                  Add Platform
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
              fetchUpdatedData={fetchPlatformsData}
              loading={loading}
            />
          </Stack>
        </Container>
        <section>
          {isAddFormOpen && (
            <PlatformAddForm onClose={handleAddFormClose} fetchUpdatedData={fetchPlatformsData} />
          )}
        </section>
      </Box>
    </>
  )
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Page
