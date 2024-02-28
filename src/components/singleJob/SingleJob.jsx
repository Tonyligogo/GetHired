import styles from './page.module.css'
import { formatDistanceToNow} from 'date-fns';

function SingleJob({job}) {
  return (
    <article className={styles.container}>
    <div className={styles.left}>
      <div className={styles.wrapper}>
        <div>
          <small className={styles.date}>
            Posted {formatDistanceToNow(new Date(job?.createdAt), {
              addSuffix: true,
            })}
          </small>
          <h3 className={styles.jobTitle}>{job?.title}</h3>
          <span>{job?.description}</span>
        </div>
        <div className={styles.bottom}>
          <span>Ksh {job?.salary}</span>
          <span className={styles.location}>{job?.locationType}, {job?.location}</span>
          <span className={styles.type}>{job?.type}</span>
        </div>
      </div>
    </div>
  </article>
  )
}

export default SingleJob