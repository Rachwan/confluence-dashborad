import { useCallback, useMemo, useState, useEffect } from 'react'
import axios from 'axios'
import Head from 'next/head'
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon'
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon'
import PlusIcon from '@heroicons/react/24/solid/PlusIcon'
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material'
import { useSelection } from 'src/hooks/use-selection'

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import { SoonTable } from 'src/sections/soon/soon-table'
import { SoonSearch } from 'src/sections/soon/soon-search'
import { applyPagination } from 'src/utils/apply-pagination'

const Page = () => {
  const [soonData, setSoonData] = useState([])

  const fetchSoonData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_END}/soon/all`)
      setSoonData(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchSoonData()
  }, [])

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const useSoon = (page, rowsPerPage) => {
    return useMemo(() => {
      return applyPagination(soonData, page, rowsPerPage)
    }, [soonData, page, rowsPerPage])
  }

  const useSoonIds = (soon) => {
    return useMemo(() => {
      return soon.map((contact) => contact.id)
    }, [soon])
  }

  const soonSelection = useSelection(useSoonIds(useSoon(page, rowsPerPage)))

  const handlePageChange = useCallback((event, value) => {
    setPage(value)
  }, [])

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value)
  }, [])

  return (
    <>
      <Head>
        <title>Soon | Confluence</title>
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
                <Typography variant='h4'>Soon Emails</Typography>
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
            </Stack>
            <SoonSearch />
            <SoonTable
              count={soonData.length}
              items={useSoon(page, rowsPerPage)}
              onDeselectAll={soonSelection.handleDeselectAll}
              onDeselectOne={soonSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={soonSelection.handleSelectAll}
              onSelectOne={soonSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={soonSelection.selected}
              fetchUpdatedData={fetchSoonData}
            />
          </Stack>
        </Container>
      </Box>
    </>
  )
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Page
