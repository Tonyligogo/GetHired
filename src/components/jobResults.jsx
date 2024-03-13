import Link from "next/link";
import SingleJob from "./singleJob/SingleJob";
import { server } from "@/server";

// const fetchJobs = async ()=>{
//   const res = await fetch(`${server}post/getPosts`, 
//   {next:{ revalidate: 100}}
//   ) 
//   if(!res.ok){
//       throw new Error('There was an error fetching the jobs')
//   }
//   return res.json();
// }

const fetchFilteredJobs = async (filterValues)=>{

    // Remove properties with empty values from filterValues
    Object.keys(filterValues).forEach(key => {
      if (filterValues[key] === '') {
        delete filterValues[key];
      }
    });

  const baseUrl = `${server}post/getFilteredPosts`; 
  const queryParams = new URLSearchParams(filterValues).toString(); 
  const url = `${baseUrl}?${queryParams}`;

  const res = await fetch(url, 
  {next:{ revalidate: 100}}
  ) 
  if(!res.ok){
      throw new Error('There was an error fetching the filtered jobs')
  }
  return res.json();
}

export default async function JobResults({filterValues, page = 1}) {
  const {q, type, location, remote} = filterValues
  const filterParams = {
    title: q || '',
    type: type || '',
    location: location || '',
    locationType: remote ? 'Remote' : ''
  };

  // const jobs = await fetchJobs()
  const filteredJobs = await fetchFilteredJobs(filterParams)

  return (
    <div>
          {filteredJobs?.map(job => (
            <Link  key={job._id} href={`/jobs/${job._id}`}> <SingleJob job={job}/> </Link>
          ))}
          {filteredJobs?.length === 0 &&(
            <p style={{textAlign:'center'}}>Oops! No jobs found. <p>Try adjusting your search filters.</p> </p>
          )}
          {/* {filteredJobs?.jobs?.length > 0 &&(
            <Pagination
            currentPage={page}
            totalPages={filteredJobs?.totalPages}
            filterValues={filterValues}
            />
          )} */}
    </div>
  )
}

// function Pagination({
//   filterValues:{q, type, location, remote},
//   currentPage,
//   totalPages
// }){
//   function generatePageLink(page){
//     const searchParams = new URLSearchParams({
//       title: q || '',
//     type: type || '',
//     location: location || '',
//     locationType: remote ? 'Remote' : '',
//     page: page.toString(),
//     })
//     return `/jobs/allJobs?${searchParams.toString()}`;
//   }
//   return <div>
//     {currentPage <= 1 ? 
//   <Link
//   href=''
//   ></Link> 
//   :
//   <Link
//   href={generatePageLink(currentPage -1)}
//   >Previous page</Link> 
//   }
//   Page {currentPage} of {totalPages} 
//     {currentPage >= totalPages ? 
//   <Link
//   href=''
//   ></Link> 
//   :
//   <Link
//   href={generatePageLink(currentPage +1)}
//   >Next page</Link> 

//   }
//   </div>
// }
