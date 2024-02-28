import JobDetailsPage from "@/components/JobDetailsPage";
import { notFound } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import { server } from "@/server";
import styles from "./Admin.module.css";

const fetchJob = async (slug) => {
  const res = await fetch(`${server}post/getSinglePost/${slug}`);
  if (!res.ok) return notFound();
  const singleJob = await res.json();
  return singleJob;
};

export default async function page({ params: { slug } }) {
  const job = await fetchJob(slug);

  return (
    <div>
      <JobDetailsPage jobPost={job} />
      <div className={styles.jobApprovalPage}>
        <AdminSidebar job={job} />
      </div>
    </div>
  );
}
