// 'use client'
import styles from './UserProfile.module.css'
import profilePic from '../../../public/react4.jpg'
import Image from 'next/image'
import Link from 'next/link'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/app/api/auth/[...nextauth]/route'
// import { useSession } from 'next-auth/react'
// import { useUser, currentUser } from "@clerk/nextjs";


const skills = ['User Interface', 'Research', 'Motion Design', 'Wireframe', 'Illustration', '3D Design'] 

export default async function UserProfileSidebar() {

    // const {data:session} = useSession() 
    // console.log(session)

    // const user = await currentUser();

  return (
    <aside className={styles.container}>
        <div className={styles.user}>
            <div>
            <Image src={profilePic} className={styles.profilePic} alt='user Profile picture' width={120} height={120} />
            </div>
            <div>
                {/* <h2 className={styles.name}>{user?.firstName} {user?.lastName}</h2> */}
                <h2 className={styles.name}>Tony Ligogo</h2>
                {/* <span className={styles.text}>UI Designer</span> */}
            </div>
            <div>
            <Link  href='/jobSeeker/65ce17ceb5f4a315858f364a'><button className={styles.btn}>View Profile</button></Link>
            </div>
        </div>
    </aside>
  )
}
