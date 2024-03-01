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
import LoadingSection from 'src/components/LoadingSection'

export const AdminsTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    fetchUpdatedData,
    loading,
  } = props

  const handleDeleteClick = async (admin) => {
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
          await axios.delete(`${process.env.NEXT_PUBLIC_BACK_END}/user/${admin._id}`)
          fetchUpdatedData()

          Swal.fire({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            icon: 'success',
          })
          onClose()
        } catch (error) {
          console.error('Error deleting admin:', error)
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
              {loading ? (
                <LoadingSection padding={'50px'} />
              ) : items && items.length === 0 && !loading ? (
                <TableRow>
                  <TableCell style={{ fontSize: '18px', fontWeight: '500', padding: '50px' }}>
                    There is no admins yet for no reason!
                  </TableCell>
                </TableRow>
              ) : (
                items.map((admin) => {
                  const isSelected = selected.includes(admin._id)
                  const createdAt = admin.createdAt
                  const formattedDate = new Date(createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })

                  return (
                    <TableRow hover key={admin._id} selected={isSelected}>
                      <TableCell style={{ fontSize: '16px' }}>{admin._id}</TableCell>
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          <Avatar
                            src={`${process.env.NEXT_PUBLIC_BACK_END}/${admin.profile}`}
                            style={{ fontSize: '16px', width: '60px', height: '60px' }}
                          >
                            {getInitials(admin.name)}
                          </Avatar>
                          <Typography variant="subtitle2" style={{ fontSize: '16px' }}>
                            {admin.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell style={{ fontSize: '16px' }}>{admin.email}</TableCell>
                      <TableCell style={{ fontSize: '16px' }}>
                        {admin.number ? admin.number : 'No Number Yet'}
                      </TableCell>
                      <TableCell style={{ fontSize: '16px' }}>{formattedDate}</TableCell>
                      <TableCell>
                        <div style={{ position: 'relative', left: '20px', width: 'fit-content' }}>
                          <div
                            onClick={() => handleDeleteClick(admin)}
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
                })
              )}
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

AdminsTable.propTypes = {
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
