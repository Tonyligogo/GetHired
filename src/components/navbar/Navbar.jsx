"use client";
import Link from "next/link";
import styles from "./page.module.css";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { server } from "@/server";


function Navbar() {

  const { data: session } = useSession();
  const [openModal, setOpenModal] = useState(false)
  const location = usePathname();

  const paths = ['login', 'register'];
  if(paths.some(path => location.includes(path))){
    return <span>GetHired</span>
  };

  return (
    <div className={styles.nav}>
      <div className={styles.leftSideLogo}>
        <Link href="/" className={styles.logo}>
          <span>GetHired</span>
        </Link>
      </div>
      <div className={styles.links}>
        <Link href="/" className={location === '/' && styles.active}>Home</Link>
       {session?.user?.role === 'JobSeeker' && <Link href="/jobs/allJobs" className={location === '/jobs/allJobs' && styles.active}>All Jobs</Link>}
       {session?.user?.role === 'Employer' && <Link href="/jobs/new" className={`${styles.btnLink} ${location === 'createJobForm' && styles.active}`}>Post a Job</Link>}
      </div>
      <div className={styles.rightSideNav}>
        {session && (
          <>
          <span className={styles.user} onClick={()=>setOpenModal(prev=>!prev)}>
            <span>
              {session?.user?.firstName} {session?.user?.lastName}
            </span>
            {session?.user?.image !== 'undefined' ? (
              <Image
                src={`${server}${session?.user?.image}`}
                alt="user image"
                height={24}
                width={24}
                className={styles.userImage}
              />
            ) : (
              <Icon icon="mingcute:user-4-fill" width="2rem" height="2rem" />
            )}
            {(openModal && session?.user?.role === 'Employer') &&
             <div className={styles.modal}>
              <Link
               href={`/employer/${session?.user?.id}`}
              >Profile</Link>
              <Link
               href="/messenger"
              >Messages</Link>
            </div>}
            
             {(openModal && session?.user?.role === 'JobSeeker') &&
             <div className={styles.modal}>
              <Link
               href={`/jobSeeker/${session?.user?.id}`}
              >Profile</Link>
              <Link
               href="/messenger"
              >Messages</Link>
            </div>}
          </span>
          </>
        )}
        {session ? (
          <button className={styles.logout} onClick={() => signOut({ callbackUrl: "/" })}>
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className={`${styles.btnLink} ${
              location === "login" && styles.active
            }`}
          >
            Sign in
          </Link>
        )}
        {!session && (
          <Link
            href="/register"
            className={`${styles.btnLink} ${
              location === "register" && styles.active
            }`}
          >
            Create account
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
