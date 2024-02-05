'use client'
import Link from 'next/link'
import styles from "./page.module.css"
import logo from '../../../public/logo.svg'
import Image from 'next/image';
import { usePathname } from 'next/navigation'
import profilePic from '../../../public/profilePic.jpg'
// import { Icon } from '@iconify/react';

const links = [
  {
    id: 1,
    title: "Home",
    url: "/"
  },
  {
    id: 2,
    title: "Landing Page",
    url: "/landingPage"
  }
]; 

function Navbar() {
  const location = usePathname()
  const paths = ['login', 'register']
  if(paths.some(path => location.includes(path))){
    return <Image src={logo} alt='logo' width={100} height={40}/>
  }
  return (
    <div className={styles.nav}>
      <div className={styles.leftSideLogo}> <Link href="/" className={styles.logo}> <span>GetHired</span> </Link> </div>
      <div className={styles.links}>
        {links.map((link)=>(
          <Link key={link.id} href={link.url} className={`${location === link?.url && styles.active}`} >{link.title}</Link>
        ))}
        {/* <Link href="/jobs/new" className={styles.postJobLink}>Post a Job</Link> */}
        <Link href="/jobs/new" className={`${styles.btnLink} ${location === 'createJobForm' && styles.active}`}>Post a Job</Link>
      </div>
      <div className={styles.rightSideNav}>
      <Link href="/" className={`${styles.btnLink} ${location === 'signIn' && styles.active}`}>Sign in</Link> 
      <Link href="/" className={`${styles.postJobLink} ${location === 'signUp' && styles.active}`}>Sign up</Link> 
      {/* <span className={styles.user}>
            <span>Tony Ligogo</span>
            <Image className={styles.profilePic} src={profilePic} alt='profilePic' width={40} height={40}/>
          </span> */}
      </div>
    </div>
  )
}

export default Navbar