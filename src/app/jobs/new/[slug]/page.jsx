import { notFound } from 'next/navigation';
import { cache } from 'react';


const getJobs = cache(async (slug) => {
    const res = await fetch('http:/localhost:8000/post/getSinglePost/'+slug)  
  if(!res.ok) return notFound();
  const singleJob = await res.json();
  return singleJob;
})

export async function generateMetadata({params:{slug}}){
    const jobsData = await getJobs(slug)

    return{
        title:jobsData.title
    }
}

export default async function page({params:{slug}}) {
    const jobPost = await getJobs(slug)

    return(
        <main>
            {singleBlog && 
                <div> 
                <h3>{singleJob?.post?.title}</h3>
                <p>{singleJob?.post?.description}</p>
                <p>{singleJob?.post?.category}</p>
                {/* {singleBlog?.post?.image && <Image src={`http://localhost:8000/${singleBlog?.post?.image}`} alt="image" width={300} height={300}/>} */}
                </div>
            }
        </main>
    )
}
