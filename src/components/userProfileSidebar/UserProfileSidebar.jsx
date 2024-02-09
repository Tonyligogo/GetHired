
import styles from './UserProfile.module.css'
import profilePic from '../../../public/react4.jpg'
import Image from 'next/image'
import { useUser, currentUser } from "@clerk/nextjs";


const skills = ['User Interface', 'Research', 'Motion Design', 'Wireframe', 'Illustration', '3D Design'] 

export default async function UserProfileSidebar() {

    const user = await currentUser();

  return (
    <aside className={styles.container}>
        <div className={styles.user}>
            <div>
            <Image src={user.imageUrl} className={styles.profilePic} alt='user Profile picture' width={120} height={120} />
            </div>
            <div>
                <h2 className={styles.name}>{user.firstName} {user.lastName}</h2>
                <span className={styles.text}>UI Designer</span>
            </div>
            <div>
            <button className={styles.btn}>View Profile</button>
            </div>
        </div>
        <div className={styles.skillsWrapper}>
            <h4 style={{marginBottom: "10px"}} >Skills & Expertise</h4>
            <div className={styles.skillsContainer}>
                {skills.map((skill, idx) => (
                    <small key={idx}>{skill}</small>
                )
                )}
            </div>
        </div>
    </aside>
  )
}
