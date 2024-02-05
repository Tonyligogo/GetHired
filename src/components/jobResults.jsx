import Link from "next/link";
import SingleJob from "./singleJob/SingleJob";

const fetchJobs = async ()=>{
  const res = await fetch('http://localhost:8000/post/getPosts', 
  {next:{ revalidate: 100}}
  ) 
  if(!res.ok){
      throw new Error('There was an error fetching the jobs')
  }
  return res.json();
}
export default async function JobResults({filterValues:{q, type, location, remote}}) {

  // const jobs = await fetch('https://jsonplaceholder.typicode.com/users')
  // .then(response => response.json())
  const jobs = await fetchJobs()

  const queryString = q?.split(" ").filter(word => word.length > 0);
  const typeString = type?.split(" ").filter(word => word.length > 0);
  const locationString = location?.split(" ").filter(word => word.length > 0);
  const remoteJobs = remote ? 'Remote' : 'On-site Hybrid';
  
  const searchString = queryString || typeString || locationString || remoteJobs
  // data.data.employees.length ? data.data.employees.filter((name)=>{
  //   return query === '' ? name : name.first_name.toLowerCase().includes(query) || name.last_name.toLowerCase().includes(query);
  // })

  return (
    <div>
          {searchString == null || searchString === 'On-site Hybrid' && jobs?.map(job => (
            <Link  key={job._id} href={`/jobs/${job._id}`}> <SingleJob job={job}/> </Link>
          ))}
          {searchString && jobs?.filter((job)=>{
            return searchString === "" ? job : job?.title?.toLowerCase().includes(searchString)
          }).map(job => (
            <Link key={job._id} href={`/jobs/${job._id}`}> <SingleJob job={job} /> </Link>
          ))}
          {jobs.length === 0 &&(
            <p>No jobs found. Try adjusting your search filters</p>
          )}
    </div>
  )
}
