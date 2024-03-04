import { useCallback, useMemo, useState, useEffect } from 'react'
import axios from 'axios'
import Head from 'next/head'
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon'
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon'
import PlusIcon from '@heroicons/react/24/solid/PlusIcon'
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material'
import { useSelection } from 'src/hooks/use-selection'

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import { SubscribersTable } from 'src/sections/subscribers/subscribers-table'
import { SubscribersSearch } from 'src/sections/subscribers/subscribers-search'
import { applyPagination } from 'src/utils/apply-pagination'

const Page = () => {
  const [subscribersData, setSubscribersData] = useState([])

  const fetchSubscribersData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_END}/subscriber/all`)
      setSubscribersData(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchSubscribersData()
  }, [])

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const useSubscribers = (page, rowsPerPage) => {
    return useMemo(() => {
      return applyPagination(subscribersData, page, rowsPerPage)
    }, [page, rowsPerPage, subscribersData])
  }

  const useSubscribersIds = (subscribers) => {
    return useMemo(() => {
      return subscribers.map((contact) => contact.id)
    }, [subscribers])
  }

  const subscribersSelection = useSelection(useSubscribersIds(useSubscribers(page, rowsPerPage)))

  const handlePageChange = useCallback((event, value) => {
    setPage(value)
  }, [])

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value)
  }, [])

  return (
    <>
      <Head>
        <title>Subscribers | Confluence</title>
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
                <Typography variant='h4'>Subscribers Emails</Typography>
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
            <SubscribersSearch />
            <SubscribersTable
              count={subscribersData.length}
              items={useSubscribers(page, rowsPerPage)}
              onDeselectAll={subscribersSelection.handleDeselectAll}
              onDeselectOne={subscribersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={subscribersSelection.handleSelectAll}
              onSelectOne={subscribersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={subscribersSelection.selected}
              fetchUpdatedData={fetchSubscribersData}
            />
          </Stack>
        </Container>
      </Box>
    </>
  )
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Page
