'use client'
import Link from 'next/link'
import styles from "./page.module.css"
import Image from 'next/image';
import { usePathname } from 'next/navigation'
import { useUser, UserButton } from "@clerk/nextjs";

const links = [
  {
    id: 1,
    title: "Home",
    url: "/"
  },
  {
    id: 2,
    title: "All Jobs",
    url: "/jobs/allJobs"
  }
]; 

function Navbar() {

  const location = usePathname()
  const { isLoaded, isSignedIn, user } = useUser()

  return (
    <div className={styles.nav}>
      <div className={styles.leftSideLogo}> <Link href="/" className={styles.logo}> <span>GetHired</span> </Link> </div>
      <div className={styles.links}>
        {links.map((link)=>(
          <Link key={link.id} href={link.url} className={`${location === link?.url && styles.active}`} >{link.title}</Link>
        ))}
        <Link href="/jobs/new" className={`${styles.btnLink} ${location === 'createJobForm' && styles.active}`}>Post a Job</Link>
      </div>
      <div className={styles.rightSideNav}>
      {!isSignedIn && <Link href="/sign-in" className={`${styles.btnLink} ${location === 'signIn' && styles.active}`}>Sign in</Link> }
      {!isSignedIn && <Link href="/sign-up" className={`${styles.postJobLink} ${location === 'signUp' && styles.active}`}>Sign up</Link>} 

      { isSignedIn && <span className={styles.user}>
        <span>{user.fullName ? user.fullName : user.username}</span>
        <UserButton afterSignOutUrl='/' />
      </span>}
      </div>
    </div>
  )
}

export default Navbar