import SingleJob from "@/components/singleJob/SingleJob";
import Link from "next/link";
import styles from "./page.module.css"

const fetchJobs = async ()=>{
    const res = await fetch('http://localhost:8000/post/getUnapprovedJobs') 
    if(!res.ok){
        console.log('There was an error fetching the unappproved jobs..from admin page',res)
    }
    const unapprovedJobs = await res.json();
    return unapprovedJobs;
}

export default async function page() {

    const jobs = await fetchJobs()

  return (
    <main className={styles.container}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <section className={styles.unapprovedJobsContainer}>
            <h2>Unapproved jobs :</h2>
            <div className={styles.jobsWrapper}>
                {jobs?.jobs?.map(job => (
                    <Link  key={job._id} href={`/admin/jobs/${job._id}`}> <SingleJob job={job}/> </Link>
                ))}
            </div>
            {!jobs?.jobs?.length > 0 && <p>There are no unapproved jobs at the moment!</p> }
        </section>
    </main>
  )
}
