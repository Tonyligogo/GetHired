import Image from 'next/image'
import styles from './page.module.css'
import { format} from 'date-fns';
import logo from '../../../public/vercel.svg'
import logo2 from '../../../public/companyLogo2.jpg'


function SingleJob({job}) {
  return (
   <article className={styles.container}>
    <div className={styles.left}>
      <Image className={styles.image} src={logo2} alt='company logo' width={100} height={100}/>
      <div className={styles.wrapper}>
        <div>
          <h3 className={styles.jobTitle}>{job?.title}</h3>
          <span>{job?.description}</span>
        </div>
        <span>{job?.companyName}</span>
        <span>{job?.salary}</span>
        <span>{job?.locationType}</span>
        <span>{job?.applicationEmail}</span>
        <span>{job?.location}</span>
      </div>
    </div>
      <div className={styles.right}>
          <span className={styles.type}>{job?.type}</span>
          <span className={styles.date}>{format(new Date(job?.createdAt), 'MMM d, yyyy HH:mm')}</span>
      </div>
   </article>
  )
}

export default SingleJob