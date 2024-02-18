'use client'
import Link from 'next/link'
import styles from "./page.module.css"
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

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
  const [username, setUsername] = useState('')
  const [id, setId] = useState('')
  useEffect(()=>{
    setUsername(session?.user?.name)
    setId(session?.user?.id)
    localStorage.setItem("id", session?.user?.id); 
    localStorage.setItem("name", session?.user?.name); 
  },[])
  console.log(session, 'from navbar')
  console.log(id)

  const location = usePathname()
  // const { isLoaded, isSignedIn, user } = useUser()

  return (
    <div className={styles.nav}>
      <div className={styles.leftSideLogo}> <Link href="/" className={styles.logo}> <span>GetHired</span> </Link> </div>
      <div className={styles.links}>
        {links.map((link)=>(
          <Link key={link.id} href={link.url} className={`${location === link?.url && styles.active}`} >{link.title}</Link>
        ))}
        {/* <Link href="/jobs/new" className={`${styles.btnLink} ${location === 'createJobForm' && styles.active}`}>Post a Job</Link> */}
      </div>
      <div className={styles.rightSideNav}>

        {session && 
            <span className={styles.user}>
              <span>{session?.user?.name}</span>
              {session?.user?.image && <Image src={`${session?.user?.image}`} alt='user image' height={24} width={24} className={styles.userImage}/>}
            </span>
          }
      {session ?
       <button className={styles.logout} onClick={()=>signOut()}>Logout</button>
       :
       <Link href="/login" className={`${styles.btnLink} ${location === 'login' && styles.active}`}>Sign in</Link>
      }
      {!session &&
       <Link href="/register" className={`${styles.btnLink} ${location === 'register' && styles.active}`}>Create account</Link>
      }
      </div>
    </div>
  )
}

export default Navbar