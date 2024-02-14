'use client'
import styles from './page.module.css'
import { Icon } from '@iconify/react';
import Image from 'next/image';
import frontImage from "../../../public/jobSearchAnim2.png"
import Link from 'next/link';
import { useSession } from 'next-auth/react'; 


export default function LandingPage() {

  const {status, data:session} = useSession();
  console.log(session);

  return (
    <div>
      <div className={styles.HomeContainer}>
        <div className={styles.left}>
          <h2 className={styles.title}>Jump-Start Your <span className={styles.careerWord} style={{color: "#f87d34"}}>Career <span className={styles.stars}><Icon icon="bi:stars" style={{color: "#f87d34"}} /></span> </span> <br /></h2>
          <div className={styles.subscribe}>
            <span className={styles.text}>The Home of Your</span>
            <div className={styles.joinBtn}>
                <Link href="/" className={styles.subscribeBtn} >
                    Dream Job
              </Link>
            </div>
          </div>
        </div>
        {/* <div className={styles.right} ref={animationContainer}></div> */}
        <div className={styles.right}> <Image src={frontImage} alt='front end image' width={612} height={450} /> </div>
      </div>
      <div className={styles.fiverrBusiness}>
        <div className={styles.fiverrBsContainer}>
          <div className={styles.leftSide}>
            <h1>Find talent your way</h1>
            <div className={styles.leftSideBody}>
              <ul>
                <li>
                    <Icon icon="jam:write" width="30"/>  
                    <p>
                        <span>No cost to join</span> 
                        <small>Register and browse professionals, explore projects, for FREE!</small>
                    </p>
                </li>
                <li>
                <Icon icon="cil:pin" width="30"/> 
                    <p>
                        <span>Post a job and hire talent</span> 
                        <small>Finding talent doesn&apos;t have to be a chore. Post a job and wait for talent to find you</small>
                    </p>
                </li>
                <li>
                <Icon icon="mdi:badge-outline" width="30"/>  
                    <p>
                        <span>Work with the best—without breaking the bank</span> 
                        <small>GetHired makes it affordable to find professionals and get things done</small>
                    </p>
                </li>
                
              </ul>
            </div>
            <button className={styles.exploreBs}>Sign up for free</button>
          </div>
          <div className={styles.rightSide}>
            <img src="https://fiverr-res.cloudinary.com/q_auto,f_auto,w_870,dpr_1.0/v1/attachments/generic_asset/asset/d9c17ceebda44764b591a8074a898e63-1599597624757/business-desktop-870-x1.png" alt="imagePlaceholder" />
          </div>
        </div>
      </div>
      <div>
        <div className={`${styles.fiverrBsContainer} ${styles.fiverrBsWrapper}`}>
          <div className={styles.leftSide}>
            <h1>Find great work</h1>
            <div className={styles.leftSideBody}>
              <ul>
                <li>
                    <Icon icon="jam:write" width="30"/>  
                    <p>
                        Meet clients you’re excited to work with and take
your career or business to new heights
                    </p>
                </li>
                <li>
                <Icon icon="cil:pin" width="30"/> 
                    <p>
                        Find opportunities for every stage of your freelance career
                    </p>
                </li>
                <li>
                <Icon icon="mdi:badge-outline" width="30"/>  
                    <p>
                        Control when, where, and how you work
                    </p>
                </li>
                <li>
                <Icon icon="mdi:badge-outline" width="30"/>  
                    <p>
                        Explore different ways to earn
                    </p>
                </li>
                
              </ul>
            </div>
            <button className={styles.exploreBs}>Find opportunities</button>
          </div>
          <div className={styles.rightSide}>
            <img className={styles.jobseekerImage} src="https://assets.materialup.com/uploads/5f0afa2b-cb25-467f-89ab-71b9303f3563/preview.jpg" alt="imagePlaceholder" />
          </div>
        </div>
      </div>
    </div>
  )
}

