import PropTypes from 'prop-types'
import axios from 'axios'
import Swal from 'sweetalert2'
import {
  Avatar,
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import { Scrollbar } from 'src/components/scrollbar'
import { getInitials } from 'src/utils/get-initials'
import { useState } from 'react'
import EditCityForm from './cities-edit-form'

export const CitiesTable = (props) => {
  const [isCityFormOpen, setIsCityFormOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState(null)

  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    fetchUpdatedData,
  } = props

  const handleEditClick = (city) => {
    setIsCityFormOpen(true)
    setSelectedCity(city)
  }

  const handleDeleteClick = async (city) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF0000',
      cancelButtonColor: '#00306e',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${process.env.NEXT_PUBLIC_BACK_END}/city/${city._id}`)
          fetchUpdatedData()

          Swal.fire({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            icon: 'success',
          })
          onClose()
        } catch (error) {
          console.error('Error deleting city:', error)
        }
      }
    })
  }

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontSize: '14px' }}>Id</TableCell>
                <TableCell style={{ fontSize: '14px' }}>Name</TableCell>
                <TableCell style={{ fontSize: '14px' }}>Created At</TableCell>
                <TableCell style={{ fontSize: '14px' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((city) => {
                const isSelected = selected.includes(city._id)
                const createdAt = city.createdAt
                const formattedDate = new Date(createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })

                return (
                  <TableRow hover key={city._id} selected={isSelected}>
                    <TableCell style={{ fontSize: '16px' }}>{city._id}</TableCell>
                    <TableCell>
                      <Stack alignItems='center' direction='row' spacing={2}>
                        <Avatar
                          src={`${process.env.NEXT_PUBLIC_BACK_END}/${city.icon}`}
                          style={{
                            fontSize: '16px',
                            width: '40px',
                            height: '40px',
                          }}
                        >
                          {getInitials(city.name)}
                        </Avatar>
                        <Typography variant='subtitle2' style={{ fontSize: '16px' }}>
                          {city.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell style={{ fontSize: '16px' }}>{formattedDate}</TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div onClick={() => handleEditClick(city)} style={{ cursor: 'pointer' }}>
                          <img
                            src='/assets/icons/pen-to-square-solid (1).svg'
                            style={{ width: '22px' }}
                            alt=''
                          />
                        </div>
                        <div onClick={() => handleDeleteClick(city)} style={{ cursor: 'pointer' }}>
                          <img
                            src='/assets/icons/trash-can-solid.svg'
                            style={{ width: '20px' }}
                            alt=''
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
            <section>
              {isCityFormOpen && (
                <EditCityForm
                  city={selectedCity}
                  onClose={() => setIsCityFormOpen(false)}
                  fetchUpdatedData={fetchUpdatedData}
                />
              )}
            </section>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component='div'
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  )
}

CitiesTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
}
