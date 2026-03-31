import styles from './Navbar.module.css'

export default function Navbar({ user, onLogout, onSignIn, onGetStarted }) {
  return (
    <nav className={styles.nav}>
      <h1 className={styles.logo}>
        Pro<span>Map</span>
      </h1>
      {user ? (
        <div className={styles.userSection}>
          <div className={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className={styles.userName}>{user.name}</span>
          <button className={styles.logout} onClick={onLogout}>Logout</button>
        </div>
      ) : (
        <div className={styles.buttons}>
          <button className={styles.signin} onClick={onSignIn}>Sign In</button>
          <button className={styles.getstarted} onClick={onGetStarted}>Get Started</button>
        </div>
      )}
    </nav>
  )
}