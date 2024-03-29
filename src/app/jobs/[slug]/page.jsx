import { notFound } from 'next/navigation';
import { cache } from 'react';
import JobDetailsPage from '@/components/JobDetailsPage';

const getJobs = cache(async (slug) => {
    const res = await fetch('http:/localhost:8000/post/getSinglePost/'+slug)  
  if(!res.ok) return notFound();
  const singleJob = await res.json();
  return singleJob;
})

export async function generateStaticParams(){
    const res =  await fetch('http://localhost:8000/post/getPosts');
    const jobs = await res.json();
  
    return jobs.map(job =>{
      slug: job?.post?._id.toString();
    })
  }

export async function generateMetadata({params:{slug}}){
    const jobsData = await getJobs(slug)
    return{
        title:jobsData?.post?.title
    }
}

export default async function page({params:{slug}}) {
    const jobPost = await getJobs(slug)
    return(
        <main>
            <JobDetailsPage jobPost={jobPost}/>
        </main>
    )
}
