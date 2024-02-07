import { format} from 'date-fns';
import Markdown from './Markdown';

export default function JobDetailsPage({jobPost}) {
  return (
    <section>
        {jobPost && 
             <div> 
                <h3>{jobPost?.post?.title}</h3>
                {jobPost?.post?.description && <Markdown>{jobPost?.post?.description}</Markdown> }
                {/* <p>{jobPost?.post?.description}</p> */}
                <span>{jobPost?.post?.type}</span>
                <span>{jobPost?.post?.companyName}</span>
                <span>{jobPost?.post?.salary}</span>
                <span>{jobPost?.post?.locationType}</span>
                <span>{jobPost?.post?.applicationEmail}</span>
                <span>{jobPost?.post?.location}</span>
                <span>{format(new Date(jobPost?.post?.createdAt), 'MMM d, yyyy HH:mm')}</span>
                {/* {singleBlog?.post?.image && <Image src={`http://localhost:8000/${singleBlog?.post?.image}`} alt="image" width={300} height={300}/>} */}
            </div>
        }
    </section>
  )
}
