"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "../employer.module.css";
import dummyProfile from "../../../../public/userProfileDummy.jpg";
import Image from "next/image";
import axios from "axios";
import { server } from "@/server";
import { formatDistanceToNow } from "date-fns";
import { Icon } from "@iconify/react";
import Messages from "@/components/messages/Messages";
import {io} from "socket.io-client"
import Notifications from "@/components/Notifications";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  const router = useRouter();
  const{data:session} = useSession();
  useEffect(()=>{
    if(!session?.user){
      router.replace('/login')
    }
  },[session])

  async function fetchDetails() {
    const res = await axios
      .get(`${server}employer/getEmployerData/${slug}`)
      .then((res) => {
        setDetails(res?.data);
      })
      .catch(() => {
        setError(true);
      });
  }
  useEffect(() => {
    fetchDetails();
  }, []);

  async function openApplicantModel(id, firstName, lastName, jobId, companyName, theJob, email) {
    setId(id);
    setCompany(companyName)
    setJobId(jobId)
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
        setCV(null)
      });
  }
 
  async function handleOpenMessagePanel(e){
    e.preventDefault()
      try {
        await axios
          .post(`${server}conversation/createConversation/${slug}/with/${id}`)
          .then(() => {
           router.push('/messenger')
          })
          .catch((err) => {
            console.log(
              err,
              "Error in messenger when fetching the conversation."
            );
          });
      } catch (error) {
        console.log(error,'Error in messenger');
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
        if(res.status === 201){
          try {
            await fetch('/api/send',{
              method:'POST',
              body: JSON.stringify({
                firstName:name,
                jobTitle,
                companyName:company,
                email
              })
            })
          } catch (error) {
           console.log(error,'Error when sending email') 
          }
        }
      })
      .catch((err) => {
        console.log(err, "Error when trying to send message");
      })
      .finally(() => {
        setNewMsg("");
      });

  }

  return (
    <main className={styles.mainContainer}>
      <section className={styles.leftSection}>
        <aside className={styles.container}>
          <div className={styles.user}>
            <div>
              {details?.user?.image ? (
                <Image
                  src={profilePic}
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
            </div>
          </div>
          <Link href="/messenger">Conversations</Link>
        </aside>
      </section>
      {error && <p>You have no posted jobs!</p>}
      <section className={styles.rightSection}>
        <div>
          <h3 className={styles.appliedJobs}>Posted Jobs</h3>
          {details?.postedJobs?.map((job, idx) => (
            <div key={job._id}>
              <article className={styles.container2}>
                <div className={styles.left}>
                  <div className={styles.wrapper}>
                    <div>
                      <small className={styles.date}>
                        Posted {formatDistanceToNow(new Date(job?.createdAt), {
                          addSuffix: true,
                        })}
                      </small>
                      <h3 className={styles.jobTitle}>{job?.title}</h3>
                      <span>{job?.description}</span>
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
              <span>Applicants</span>
              <div key={idx}>
                {job?.applicants?.map((applicant) => (
                  <span
                  key={applicant._id}
                  className={styles.applicant}
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
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      {modalOpen && (
        <section className={styles.modal}>
          <p>{name}</p>
          {cv !== null ? (
            <div className={styles.cv}>
              <div>
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
                {skills?.map((skill, idx) => (
                  <small key={idx} className={styles.skill}>
                    {skill}
                  </small>
                ))}
              </div>
              <div>
              </div>
              
            </div>
          ) : <p>This applicant does not have a CV yet</p> }
          <button className={styles.contact} onClick={handleOpenMessagePanel}>Contact</button>
          <button className={styles.contact} onClick={handleHire}>Hire</button>
          <button onClick={() => setModalOpen(false)}>Close</button>
        </section>
      )}
    </main>
  );
}
