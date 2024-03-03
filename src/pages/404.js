import Head from 'next/head'
import Link from 'next/link'
import styles from '../../styles/404.module.css'

const Page = () => (
  <>
    <Head>
      <title>Page Not Found - Confluence</title>
    </Head>
    <main className={styles.main__wrapper}>
      <div className={styles.main}>
        <div className={`container ${styles.wrapper}`}>
          <div className={styles.content}>
            <img src='/assets/images/404.png'
              alt=''
            />
            <p className={styles.message}>
              Seems like you've taken a detour in the dashboard journey. Redirecting you to explore
              influential connections in the dashboard realm.
            </p>
            <div className={styles.buttonWrapper}>
              <Link href={"/"}>
                <div className={styles.button}>Back To Overview</div>
              </Link>
            </div>
          </div>
          <div className={styles.mainImage}>
            <img src='/assets/images/404-page.png' alt='A Sad Guy' />
          </div>
        </div>
      </div>
    </main>
  </>
)

export default Page
