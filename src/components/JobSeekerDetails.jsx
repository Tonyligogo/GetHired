// import Link from "next/link";
// import { server } from "@/server";

// const fetchJobSeekerDetails = async (id)=>{
//   const res = await fetch(`${server}jobSeeker/getJobSeekerDetails/${id}`, 
//   {next:{ revalidate: 100}}
//   ) 
//   if(!res.ok){
//       console.log(res)
//   }
//   return res.json();
// }
// export default async function JobSeekerDetails({id}) {

//   const jobSeekerDetails = await fetchJobSeekerDetails(id)
//   console.log(jobSeekerDetails)

//   return (
//     <div>
          
//     </div>
//   )
// }
