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

export const BusinessesTable = (props) => {
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

  const handleDeleteClick = async (business) => {
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
          await axios.delete(`${process.env.NEXT_PUBLIC_BACK_END}/user/${business._id}`)
          fetchUpdatedData()

          Swal.fire({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            icon: 'success',
          })
          onClose()
        } catch (error) {
          console.error('Error deleting business:', error)
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
                <TableCell style={{ fontSize: '14px' }}>Email</TableCell>
                <TableCell style={{ fontSize: '14px' }}>Number</TableCell>
                <TableCell style={{ fontSize: '14px' }}>Created At</TableCell>
                <TableCell style={{ fontSize: '14px' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((business) => {
                const isSelected = selected.includes(business._id)
                const createdAt = business.createdAt
                const formattedDate = new Date(createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })

                return (
                  <TableRow hover key={business._id} selected={isSelected}>
                    <TableCell style={{ fontSize: '16px' }}>{business._id}</TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar
                          src={`${process.env.NEXT_PUBLIC_BACK_END}/${business.profile}`}
                          style={{ fontSize: '16px', width: '60px', height: '60px' }}
                        >
                          {getInitials(business.name)}
                        </Avatar>
                        <Typography variant="subtitle2" style={{ fontSize: '16px' }}>
                          {business.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell style={{ fontSize: '16px' }}>{business.email}</TableCell>
                    <TableCell style={{ fontSize: '16px' }}>{business.number}</TableCell>
                    <TableCell style={{ fontSize: '16px' }}>{formattedDate}</TableCell>
                    <TableCell>
                      <div style={{ position: 'relative', left: '20px', width: 'fit-content' }}>
                        <div
                          onClick={() => handleDeleteClick(business)}
                          style={{ cursor: 'pointer' }}
                        >
                          <img
                            src="/assets/icons/trash-can-solid.svg"
                            style={{ width: '20px' }}
                            alt=""
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
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

BusinessesTable.propTypes = {
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
