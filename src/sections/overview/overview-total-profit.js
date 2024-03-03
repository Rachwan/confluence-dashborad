import { useEffect, useState } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
// import CurrencyDollarIcon from '@heroicons/react/24/solid/CurrencyDollarIcon'
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material'
import UsersIcon from '@heroicons/react/24/solid/UsersIcon'

export const OverviewTotalProfit = (props) => {
  const { value, sx } = props
  const [businessesData, setBusinessesData] = useState([])
  const fetchBusinessesData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_END}/user/get/business`)
      setBusinessesData(response.data)
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchBusinessesData()
  }, [])
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems='flex-start' direction='row' justifyContent='space-between'
          spacing={3}>
          <Stack spacing={1}>
            <Typography color='text.secondary' variant='overline'>
              Total bussineses
            </Typography>
            <Typography variant='h4'>{businessesData && businessesData.length}</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'primary.main',
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              {/* <CurrencyDollarIcon /> */}
              <UsersIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  )
}

OverviewTotalProfit.propTypes = {
  value: PropTypes.string,
  sx: PropTypes.object,
}
