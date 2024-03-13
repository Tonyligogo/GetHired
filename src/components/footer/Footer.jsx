import styles from './page.module.css'

function Footer() {

  return (
    <footer className={styles.footer}>
        <div className={styles.tabs}>
        <div className={styles.blogy}>
                <p>GetHired</p>
                <p className={styles.text}>Connecting talents with opportunities</p>
            </div>
            <div className={styles.right}>
                <div className={styles.copyright}>
                    <p className={styles.copyrightText}>&copy; GetHired 2024. Made by ligogo.</p>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer