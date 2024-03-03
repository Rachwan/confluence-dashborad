import { useEffect, useState } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import ArrowDownIcon from '@heroicons/react/24/solid/ArrowDownIcon'
import ArrowUpIcon from '@heroicons/react/24/solid/ArrowUpIcon'
import UsersIcon from '@heroicons/react/24/solid/UsersIcon'
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material'

export const OverviewTotalCustomers = (props) => {
  const { difference, positive = false, sx, value } = props
  const [influencersData, setinfluencersData] = useState([])

  const fetchinfluencersData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_END}/user/get/influencer`)
      setinfluencersData(response.data)
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchinfluencersData()
  }, [])

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems='flex-start' direction='row' justifyContent='space-between'
          spacing={3}>
          <Stack spacing={1}>
            <Typography color='text.secondary' variant='overline'>
              Total influencers
            </Typography>
            <Typography variant='h4'>{influencersData && influencersData.length}</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'success.main',
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <UsersIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
        {difference && (
          <Stack alignItems='center' direction='row' spacing={2}
            sx={{ mt: 2 }}>
            <Stack alignItems='center' direction='row' spacing={0.5}>
              <SvgIcon color={!positive ? 'success' : 'error'} fontSize='small'>
                {!positive ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </SvgIcon>
              <Typography color={!positive ? 'success.main' : 'error.main'} variant='body2'>
                {difference}%
              </Typography>
            </Stack>
            <Typography color='text.secondary' variant='caption'>
              Since last month
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}

OverviewTotalCustomers.propTypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  value: PropTypes.string.isRequired,
  sx: PropTypes.object,
}
