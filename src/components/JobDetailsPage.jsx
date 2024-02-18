import { format, formatDistanceToNow} from 'date-fns';
import Markdown from './Markdown';
import styles from './page.module.css'

export default function JobDetailsPage({jobPost}) {
  return (
    <section className={styles.container}>
        {jobPost && 
             <div> 
                <div className={styles.heading}>
                <h2 className={styles.title}>{jobPost?.post?.title}</h2>
                <small className={styles.date}>
                        Posted {formatDistanceToNow(new Date(jobPost?.post?.createdAt), {
                          addSuffix: true,
                        })}
                      </small>
                      </div>
                {jobPost?.post?.description && 
                <div className={styles.description}>
                  <Markdown>{jobPost?.post?.description}</Markdown>
                </div> }
                <div className={styles.bottom}>
                <span>{jobPost?.post?.type}</span>
                <span>Ksh {jobPost?.post?.salary}</span>
                {jobPost?.post?.location ?
                 <span>{jobPost?.post?.locationType}, {jobPost?.post?.location}</span>
                :
                  <span>{jobPost?.post?.locationType}</span>
                }
                </div>
            </div>
        }
    </section>
  )
}
