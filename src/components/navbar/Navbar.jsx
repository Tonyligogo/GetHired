'use client'
import Link from 'next/link'
import styles from "./page.module.css"
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

// import { useUser, UserButton } from "@clerk/nextjs";

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

  const {status, data:session} = useSession();

  const location = usePathname()
  // const { isLoaded, isSignedIn, user } = useUser()

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

      {status === 'authenticated' ?
       <button className={styles.logout} onClick={()=>signOut('google')}>Logout</button>
       :
       <Link href="/login" className={`${styles.btnLink} ${location === 'login' && styles.active}`}>Sign in</Link>
      }
      {/* {!isSignedIn && <Link href="/sign-in" className={`${styles.btnLink} ${location === 'signIn' && styles.active}`}>Sign in</Link> } */}
      {/* {!isSignedIn && <Link href="/sign-up" className={`${styles.postJobLink} ${location === 'signUp' && styles.active}`}>Sign up</Link>}  */}

      {session && 
          <span className={styles.user}>
            <span>{session?.user?.name}</span>
            <Image src={`${session?.user?.image}`} alt='user image' height={24} width={24} className={styles.userImage}/>
          </span>
        }
      {/* { isSignedIn && <span className={styles.user}>
        <span>{user.fullName ? user.fullName : user.username}</span>
        <UserButton afterSignOutUrl='/' />
      </span>} */}
      </div>
    </div>
  )
}

export default Navbar