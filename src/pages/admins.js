import { useCallback, useMemo, useState, useEffect } from 'react'
import axios from 'axios'
import Head from 'next/head'
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon'
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon'
import PlusIcon from '@heroicons/react/24/solid/PlusIcon'
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material'
import { useSelection } from 'src/hooks/use-selection'

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout'
import { AdminsTable } from 'src/sections/admins/admins-table'
import { AdminsSearch } from 'src/sections/admins/admins-search'
import { applyPagination } from 'src/utils/apply-pagination'
import AdminAddForm from 'src/sections/admins/admins-add-form'

const Page = () => {
  const [adminsData, setAdminsData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAdminsData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_END}/user/get/admin`)
      setAdminsData(response.data)
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchAdminsData()
  }, [])

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const useAdmins = (page, rowsPerPage) => {
    return useMemo(() => {
      return applyPagination(adminsData, page, rowsPerPage)
    }, [adminsData, page, rowsPerPage])
  }

  // const useAdmins = useCallback((page, rowsPerPage) => {
  //   return applyPagination(adminsData, page, rowsPerPage);
  // }, [page, rowsPerPage]);

  const useAdminsIds = (admins) => {
    return useMemo(() => {
      return admins.map((admin) => admin.id)
    }, [admins])
  }

  const adminsSelection = useSelection(useAdminsIds(useAdmins(page, rowsPerPage)))

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
        <title>Admins | Confluence</title>
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
                <Typography variant='h4'>Admins</Typography>
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
                  Add Admin
                </Button>
              </div>
            </Stack>
            <AdminsSearch />
            <AdminsTable
              count={adminsData.length}
              items={useAdmins(page, rowsPerPage)}
              onDeselectAll={adminsSelection.handleDeselectAll}
              onDeselectOne={adminsSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={adminsSelection.handleSelectAll}
              onSelectOne={adminsSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={adminsSelection.selected}
              fetchUpdatedData={fetchAdminsData}
              loading={loading}
            />
          </Stack>
        </Container>
        <section>
          {isAddFormOpen && (
            <AdminAddForm onClose={handleAddFormClose} fetchUpdatedData={fetchAdminsData} />
          )}
        </section>
      </Box>
    </>
  )
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Page
