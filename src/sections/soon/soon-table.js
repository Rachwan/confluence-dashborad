import PropTypes from 'prop-types'
import axios from 'axios'
import Swal from 'sweetalert2'
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material'
import { Scrollbar } from 'src/components/scrollbar'

export const SoonTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => { },
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    fetchUpdatedData,
  } = props

  const handleDeleteClick = async (soon) => {
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
          await axios.delete(`${process.env.NEXT_PUBLIC_BACK_END}/soon/${soon._id}`)
          fetchUpdatedData()

          Swal.fire({
            title: 'Deleted!',
            text: `${soon?.email || "The email"}has been deleted.`,
            icon: 'success',
          })
          onClose()
        } catch (error) {
          console.error('Error deleting soon:', error)
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
                <TableCell style={{ fontSize: '14px' }}>Email</TableCell>
                <TableCell style={{ fontSize: '14px' }}>Created At</TableCell>
                <TableCell style={{ fontSize: '14px' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((soon) => {
                const isSelected = selected.includes(soon._id)
                const createdAt = soon.createdAt
                const formattedDate = new Date(createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })

                return (
                  <TableRow hover key={soon._id} selected={isSelected}>
                    <TableCell style={{ fontSize: '16px' }}>{soon._id}</TableCell>
                    <TableCell style={{ fontSize: '16px' }}>{soon.email}</TableCell>
                    <TableCell style={{ fontSize: '16px' }}>{formattedDate}</TableCell>
                    <TableCell>
                      <div
                        style={{
                          position: 'relative',
                          left: '20px',
                          width: 'fit-content',
                        }}
                      >
                        <div onClick={() => handleDeleteClick(soon)} style={{ cursor: 'pointer' }}>
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

SoonTable.propTypes = {
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
