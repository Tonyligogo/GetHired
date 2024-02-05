import Image from 'next/image'
import styles from './page.module.css'
import logo from '../../../public/vercel.svg'
// import { Icon } from '@iconify/react';


function SingleJob({job}) {

  return (
   <article className={styles.container}>
    <Image src={logo} alt='company logo' width={100} height={100}/>
    <div className={styles.wrapper}>
      <div>
        <h3 className={styles.jobTitle}>{job?.title}</h3>
        <span>{job?.description}</span>
      </div>
      {/* <span>{job.email}</span>
      <span>{job.address?.city}</span>
      <span>{job.address?.zipcode?.toString().split('-')[0]}</span> */}
    </div>
   </article>
  )
}

export default SingleJob