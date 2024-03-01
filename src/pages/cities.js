import { useCallback, useMemo, useState, useEffect } from 'react'
import axios from 'axios'
import Head from 'next/head'
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon'
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon'
import PlusIcon from '@heroicons/react/24/solid/PlusIcon'
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material'
import { useSelection } from 'src/hooks/use-selection'

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import { CitiesTable } from 'src/sections/cities/cities-table'
import { CitiesSearch } from 'src/sections/cities/cities-search'
import { applyPagination } from 'src/utils/apply-pagination'
import CityAddForm from 'src/sections/cities/cities-add-form'
const Page = () => {
  const [citiesData, setCitiesData] = useState([])

  const fetchCitiesData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_END}/city/all`)
      setCitiesData(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchCitiesData()
  }, [])

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const useCities = (page, rowsPerPage) => {
    return useMemo(() => {
      return applyPagination(citiesData, page, rowsPerPage)
    }, [citiesData, page, rowsPerPage])
  }

  const useCitiesIds = (cities) => {
    return useMemo(() => {
      return cities.map((city) => city.id)
    }, [cities])
  }

  const citiesSelection = useSelection(useCitiesIds(useCities(page, rowsPerPage)))

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
        <title>Cities | Confluence</title>
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
                <Typography variant="h4">Cities</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    }
                    style={{ fontSize: '16px' }}
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
                    style={{ fontSize: '16px' }}
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
                    fontSize: '16px',
                    backgroundColor: 'var(--second-blue)',
                    borderRadius: '30px',
                  }}
                  variant="contained"
                >
                  Add City
                </Button>
              </div>
            </Stack>
            <CitiesSearch />
            <CitiesTable
              count={citiesData.length}
              items={useCities(page, rowsPerPage)}
              onDeselectAll={citiesSelection.handleDeselectAll}
              onDeselectOne={citiesSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={citiesSelection.handleSelectAll}
              onSelectOne={citiesSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={citiesSelection.selected}
              fetchUpdatedData={fetchCitiesData}
            />
          </Stack>
        </Container>
        <section>
          {isAddFormOpen && (
            <CityAddForm onClose={handleAddFormClose} fetchUpdatedData={fetchCitiesData} />
          )}
        </section>
      </Box>
    </>
  )
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Page
