import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import JobSeeker from "@/components/jobSeeker/JobSeeker";
import { server } from "@/server";
import { getServerSession } from "next-auth";

const fetchJobSeekers = async (niche) => {
  const res = await fetch(
    `${server}jobSeeker/getRelevantJobSeekers?niche=${niche}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) {
    throw new Error("There was an error fetching the jobseekers");
  }
  return res.json();
};

export default async function page() {
  const session = await getServerSession(authOptions);
  const niche = session?.user?.niche;
  const jobSeekers = await fetchJobSeekers(niche);
  if (!session?.user?.role === "Employer") return <p>Access Denied</p>;

  return (
    <section>
      {!session?.user?.role === "Employer" ? (
        <div>
          {jobSeekers.length > 0 ? (
            jobSeekers.map((jobSeeker) => (
              <JobSeeker jobSeeker={jobSeeker} employerId={session?.user?.id} />
            ))
          ) : (
            <p>There are no Job-Seekers within your niche.</p>
          )}
        </div>
      ) : (
        <p>Only employers can access this page!</p>
      )}
    </section>
  );
}
