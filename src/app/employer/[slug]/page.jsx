"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "../employer.module.css";
import dummyProfile from "../../../../public/userProfileDummy.jpg";
import Image from "next/image";
import axios from "axios";
import { server } from "@/server";
import { formatDistanceToNow } from "date-fns";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import JobSeeker from "@/components/jobSeeker/JobSeeker";

export default function page({ params: { slug } }) {
  const [details, setDetails] = useState(null);
  const [cv, setCV] = useState(null);
  const [error, setError] = useState(false);
  const [id, setId] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [company, setCompany] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  const [skills, setSkills] = useState([]);
  const [jobSeekers, setJobSeekers] = useState([]);
  const [openPostedJobs, setOpenPostedJobs] = useState(false);
  const [jobSeekersFetched, setJobSeekersFetched] = useState(false);
  const [visibleApplicants, setVisibleApplicants] = useState({});
  const [activeTab, setActiveTab] = useState('recommended');

  const router = useRouter();
  const { status,data: session } = useSession();
  useEffect(() => {
    if(status !== 'loading'){
      if (!session?.user) {
        router.replace("/login");
      }
    }
  }, [session]);

  useEffect(() => {
    fetchDetails();
    fetchJobSeekers();
  }, []);

  async function fetchDetails() {
    setJobSeekersFetched(false)
    setOpenPostedJobs(true)
    const res = await axios
      .get(`${server}employer/getEmployerData/${slug}`)
      .then((res) => {
        setDetails(res?.data);
      })
      .catch((error) => {
        console.log(error, "error in employer page");
        setError(true);
      });
  }

  // ${session?.user?.niche}
  async function fetchJobSeekers(){
    setOpenPostedJobs(false)
   const niche = 'IT'
   await axios.get(
     `${server}jobSeeker/getRelevantJobSeekers?niche=${niche}`
   ).then((res)=>{
     setJobSeekers(res.data)
     setJobSeekersFetched(true)
   }).catch((err)=>{
     console.log(err,'There was an error fetching jobseekers')
   })
 }

 function openYourPostedJobs(){
  setOpenPostedJobs(true);
  setJobSeekersFetched(false);
  setActiveTab('posted');
 }
 function openJobSeekers(){
  setOpenPostedJobs(false);
  setJobSeekersFetched(true);
  setActiveTab('recommended');
 }

  async function openApplicantModel(
    id,
    firstName,
    lastName,
    jobId,
    companyName,
    theJob,
    email
  ) {
    setId(id);
    setCompany(companyName);
    setJobId(jobId);
    setJobTitle(theJob);
    setEmail(email);
    setName(firstName + " " + lastName);
    setModalOpen(true);
    await axios
      .get(`${server}jobSeekerCV/getSingleCV/${id}`)
      .then((res) => {
        setCV(res?.data?.cv);
        setSkills(
          res?.data?.cv?.skills[0]?.split(",").map((skill) => skill.trim())
        );
      })
      .catch(() => {
        console.log("No cv found");
        setCV(null);
      });
  }

  async function handleOpenMessagePanel(e) {
    e.preventDefault();
    const data = {jobTitle}
    try {
      await axios
        .post(`${server}conversation/createConversation/${slug}/with/${id}`,data)
        .then(() => {
          router.push("/messenger");
        })
        .catch((err) => {
          console.log(
            err,
            "Error in messenger when fetching the conversation."
          );
        });
    } catch (error) {
      console.log(error, "Error in messenger");
      // if (error.response.status === 404) {
      //   console.log('No conversation found.')
      // }
    }
  }

  async function handleHire(e) {
    e.preventDefault();
    await axios
      .post(`${server}hireJobSeeker/${id}/jobId/${jobId}`)
      .then(async (res) => {
        if (res.status === 201) {
          try {
            await fetch("/api/send", {
              method: "POST",
              body: JSON.stringify({
                firstName: name,
                jobTitle,
                companyName: company,
                email,
              }),
            });
          } catch (error) {
            console.log(error, "Error when sending email");
          }
        }
      })
      .catch((err) => {
        console.log(err, "Error when trying to send message");
      });
  }

  const toggleApplicantsVisibility = (jobId) => {
    setVisibleApplicants((prevState) => ({
      ...prevState,
      [jobId]: !prevState[jobId], // Toggle visibility for the specified job
    }));
  };

  async function dismissApplicant(jobID, applicantID) {
    // e.preventDefault()
    await axios
      .post(`${server}employer/jobs/${jobID}/dismiss/${applicantID}`)
      .then(() => fetchDetails());
  }

  return (
    <main className={styles.mainContainer}>
      <section className={styles.leftSection}>
        <aside className={styles.container}>
          <div className={styles.user}>
            <div>
              {details?.user?.image ? (
                <Image
                  src={`${server}${details?.user?.image}`}
                  className={styles.profilePic}
                  alt="user Profile picture"
                  width={120}
                  height={120}
                />
              ) : (
                <Image
                  src={dummyProfile}
                  alt="user Profile picture"
                  width={150}
                  height={150}
                />
              )}
            </div>
            <div>
              <h3 className={styles.name}>
                {details?.user?.firstName} {details?.user?.lastName}
              </h3>
              <h3 className={styles.name}>Your coins: {details?.coins}</h3>
              <Link href={`/subscriptionModal/${session?.user?.role}`} className={styles.summary}>Buy coins</Link>
            </div>
          </div>
        </aside>
      </section>
      {error && <p>You have no posted jobs!</p>}
      <section className={styles.rightSection}>
        <div>
          <div style={{display:'flex', gap:'4px'}}>
            <p className={activeTab === 'recommended' ? styles.activeTab : ''} onClick={openJobSeekers}>Recommended JobSeekers</p>
            <p className={activeTab === 'posted' ? `${styles.activeTab} ${styles.appliedJobs}`: styles.appliedJobs} onClick={openYourPostedJobs}>Posted Jobs</p>
          </div>

          {openPostedJobs && <div>
            {details?.postedJobs?.length === 0 && (
              <>
                <p className={styles.noPostText}>You have no posted jobs!</p>
                <div className={styles.howItWorksWrapper}>
                  <div className={styles.howItWorks}>
                    <h1 className={styles.howItWorksTitle}>How to post a job?</h1>
                    <span>It&apos;s super easy! In only 3 steps:</span>
                    <ul className={styles.list}>
                      <li>
                        Make sure you have at least 10 coins. If not,{" "}
                        <Link href={`/subscriptionModal/${session?.user?.role}`} className={styles.buyCoins}>buy coins here</Link> 
                      </li>
                      <li>Click on the 'Post a Job' button in the navbar.</li>
                      <li>Fill the details about your job.</li>
                    </ul>
                    <span>It&apos;s that easy!</span>
                  </div>
                  <div className={styles.whatAreCoins}>
                    <h1 className={styles.howItWorksTitle}>What are coins?</h1>
                    <ul className={styles.list}>
                      <li>
                        Coins are virtual tokens that enable you to post jobs.
                      </li>
                      <li>You need 10 coins to post a job.</li>
                    </ul>
                    <span>
                      Toggle the <strong>What are coins</strong> for more
                      information
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>}
              {openPostedJobs && <div>
          {details?.postedJobs?.map((job, idx) => (
            <div key={job._id} className={styles.postedJobsContainer}>
              <article className={styles.container2}>
                <div className={styles.left}>
                  <div className={styles.wrapper}>
                    <div>
                      <small className={styles.date}>
                        Posted{" "}
                        {formatDistanceToNow(new Date(job?.createdAt), {
                          addSuffix: true,
                        })}
                      </small>
                      <h3 className={styles.jobTitle}>{job?.title}</h3>
                      <span>{job?.description}</span>
                      <div className={styles.skillsContainer2}>
                        {job?.requirements?.map((requirement, idx) => (
                          <small key={idx} className={styles.skill}>
                            {requirement}
                          </small>
                        ))}
                      </div>
                    </div>
                    <div className={styles.bottom}>
                      <span>Ksh {job?.salary}</span>
                      <span className={styles.location}>
                        <Icon icon="mdi:location-on-outline" />
                        {job?.locationType} {job?.location}
                      </span>
                      <span className={styles.type}>{job?.type}</span>
                    </div>
                  </div>
                </div>
              </article>
              <div key={idx} className={styles.applicantsWrapper}>
                <span
                  onClick={() => toggleApplicantsVisibility(job._id)}
                  className={styles.applicantToggle}
                >
                  {job?.applicants?.length} {job?.applicants?.length !== 1 ? 'Applicants' : 'Applicant'}
                  {visibleApplicants[job._id] ? (
                    <Icon
                      icon="iconamoon:arrow-right-2-light"
                      width="1.2rem"
                      height="1.2rem"
                      style={{ color: "black" }}
                    />
                  ) : (
                    <Icon
                      icon="iconamoon:arrow-down-2-light"
                      width="1.2rem"
                      height="1.2rem"
                      style={{ color: "black" }}
                    />
                  )}
                </span>
                {visibleApplicants[job._id] && (
                  <div>
                    {job?.applicants?.map((applicant) => (
                      <span key={applicant._id} className={styles.applicant}>
                        <small
                          onClick={() =>
                            openApplicantModel(
                              applicant._id,
                              applicant?.firstName,
                              applicant?.lastName,
                              job._id,
                              job.companyName,
                              job.title,
                              applicant.email
                            )
                          }
                        >
                          {applicant?.firstName} {applicant?.lastName}
                        </small>
                        <small
                          onClick={() =>
                            dismissApplicant(job._id, applicant._id)
                          }
                          className={styles.dismissBtn}
                        >
                          Dismiss
                        </small>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
              </div>}
        </div>

        <div>
          {jobSeekersFetched && jobSeekers?.length > 0 && (
            jobSeekers.map((jobSeeker) => (
              <JobSeeker jobSeeker={jobSeeker} employerId={session?.user?.id} key={jobSeeker.user._id}/>
            ))
          )}
          {jobSeekersFetched && jobSeekers?.length === 0 && (
            <p>There are no Job-Seekers within your niche.</p>
          )}
        </div>
      </section>
      {modalOpen && (
        <section className={styles.modal}>
          <p>
            {" "}
            <span style={{ display: "inline-block", fontWeight: "600" }}>
              Applicant:
            </span>{" "}
            {name}
          </p>
          {cv !== null ? (
            <div className={styles.cv}>
              <div className={styles.about}>
                <p>{cv.about}</p>
              </div>
              <div>
                <h4>Education</h4>
                <p>{cv.education}</p>
              </div>
              <div>
                <h4>work</h4>
                <p>{cv.workExperience}</p>
              </div>
              <div>
                <h4>Skills</h4>
                <div className={styles.skillsContainer2}>
                  {skills?.map((skill, idx) => (
                    <small key={idx} className={styles.skill}>
                      {skill}
                    </small>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p>This applicant does not have a CV yet</p>
          )}
          <button className={styles.contact} onClick={handleOpenMessagePanel}>
            Contact
          </button>
          <button className={styles.contact} onClick={handleHire}>
            Hire
          </button>
          <button onClick={() => setModalOpen(false)}>Close</button>
        </section>
      )}
    </main>
  );
}
