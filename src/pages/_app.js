import Head from 'next/head'
import { CacheProvider } from '@emotion/react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { AuthConsumer, AuthProvider } from 'src/contexts/auth-context'
import { useNProgress } from 'src/hooks/use-nprogress'
import { createTheme } from 'src/theme'
import { createEmotionCache } from 'src/utils/create-emotion-cache'
import 'simplebar-react/dist/simplebar.min.css'
import { UserProvider } from 'src/contexts/UserContext'
import '../../styles/main.css'
import '../../styles/styles.css'
import axios from 'axios'
axios.defaults.withCredentials = true

const clientSideEmotionCache = createEmotionCache()

const SplashScreen = () => null

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  useNProgress()

  const getLayout = Component.getLayout ?? ((page) => page)

  const theme = createTheme()

  return (
    <UserProvider>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>Confluence</title>
          <meta name='viewport' content='initial-scale=1, width=device-width' />
          <link rel='icon' href='/favicon.svg' />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
        </Head>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AuthProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AuthConsumer>
                {(auth) =>
                  auth.isLoading ? <SplashScreen /> : getLayout(<Component {...pageProps} />)
                }
              </AuthConsumer>
            </ThemeProvider>
          </AuthProvider>
        </LocalizationProvider>
      </CacheProvider>
    </UserProvider>
  )
}

export default App
