import JobDetailsPage from "@/components/JobDetailsPage";
import { notFound } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

const fetchJob = async (slug)=>{
    const res = await fetch('http:/localhost:8000/post/getSinglePost/'+slug)  
    if(!res.ok) return notFound();
    const singleJob = await res.json();
    return singleJob;
}

export default async function page({params: {slug}}) {

    const job = await fetchJob(slug)

  return (
    <div>
        <JobDetailsPage jobPost={job}/>
        <AdminSidebar job={job}/>
    </div>
  )
}
