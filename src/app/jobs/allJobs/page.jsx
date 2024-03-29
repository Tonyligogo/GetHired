import JobResults from "@/components/jobResults";
import JobFilterSidebar from "@/components/jobfiltersidebar/JobFilterSidebar";
import styles from './page.module.css';
import { auth } from "@clerk/nextjs";
import UserProfileSidebar from "@/components/userProfileSidebar/UserProfileSidebar";

export function generateMetadata({
    searchParams: {q, type, location, remote}
  }){
    return{
      title: `${getTitle({q, type, location, remote: remote === "true"})} | GetHired`
    }
  }
  
  function getTitle({q, type, location, remote}){
    const titlePrefix = q 
    ? `${q} jobs`
    :type
      ? `${type} developer jobs`
      : remote
        ? 'Remote Developer Jobs'
        :"All developer jobs";
  
      const titleSuffix = location ? ` in ${location}`:"";
  
      return `${titlePrefix}${titleSuffix}`
  }

export default function AllJobs({searchParams:{q, type, location, remote}}) {
  const { userId } = auth();

    const filterValues = {
        q,
        type,
        location,
        remote: remote === "true"
      }

  return (
    <main className={styles.container}>
    <div className={styles.heading}>
      <h1>{getTitle(filterValues)}</h1>
      <span>Find your dream job</span>
    </div>
    <section className={styles.jobs}>
      <JobFilterSidebar defaultValues={filterValues}/>
      <JobResults filterValues={filterValues}/>
      {userId &&  <UserProfileSidebar/> }
    </section>
  </main>
  )
}
