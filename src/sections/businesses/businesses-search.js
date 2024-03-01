import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon'
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material'
import { useState } from 'react'

export const BusinessesSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value
    setSearchTerm(newSearchTerm)
    onSearch(newSearchTerm) // Trigger the callback function with the new search term
  }

  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        defaultValue=""
        fullWidth
        placeholder="Search Business"
        value={searchTerm}
        onChange={handleSearchChange}
        startAdornment={
          <InputAdornment position="start">
            <SvgIcon color="action" fontSize="small">
              <MagnifyingGlassIcon />
            </SvgIcon>
          </InputAdornment>
        }
        sx={{ maxWidth: 500 }}
      />
    </Card>
  )
}
