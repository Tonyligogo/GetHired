"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "../jobseeker.module.css";
import dummyProfile from '../../../../public/userProfileDummy.jpg'
import Image from "next/image";
import axios from "axios";
import { server } from "@/server";
import { formatDistanceToNow } from "date-fns";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function page({ params: { slug } }) {
  const {data:session} = useSession()
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [cvPosted, setCvPosted] = useState(false);
  const [errPostingCV, setErrPostingCV] = useState(false);
  const [formValues, setFormValues] = useState({
    about: "",
    education: "",
    workExperience: "",
    skills: "",
  });
  const [skills, setSkills] = useState([]);

  function handleChange(e) {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  }

  async function fetchDetails() {
    const res = await axios
      .get(`${server}jobSeeker/getJobSeekerDetails/${slug}`)
      .then((res) => {
        setDetails(res?.data);
        setSkills(
          res?.data?.cv?.skills[0]?.split(",").map((skill) => skill.trim())
        );
        setCvPosted(false)
      })
      .catch(()=>{
        setError(true)
      })
  }
  useEffect(() => {
    fetchDetails();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrPostingCV(false)
    const data = {
      about: formValues.about,
      education: formValues.education,
      workExperience: formValues.workExperience,
      skills: formValues.skills,
    };

    await axios
      .post(`${server}jobSeeker/jobSeekerCV/postCV/${slug}`, data)
      .then(() => {
        setFormValues({
          about: "",
          education: "",
          workExperience: "",
          skills: "",
        });
        setCvPosted(true);
        fetchDetails();
      })
      .catch((err) => {
        setErrPostingCV(true)
        console.log(err, 'Error when posting cv');
      })
      .finally(() => {
        setLoading(false);
        setUpdate(false)
      });
  }

  return (
    <main className={styles.mainContainer}>
      <section className={styles.leftSection}>
        <aside className={styles.container}>
          <div className={styles.user}>
            <div>
              {details?.user?.image ?
                <Image
                src={`${server}${details?.user?.image}`}
                className={styles.profilePic}
                alt="user Profile picture"
                width={120}
                height={120}
              />
              :
              <Image src={dummyProfile} alt='user Profile picture' width={150} height={150} />
            }
            </div>
            <div>
              <h3 className={styles.name}>{details?.user?.firstName} {details?.user?.lastName}</h3>
              {details?.cv && <span style={{display:'block'}} className={styles.text}>{details?.cv?.about}</span>}
              {details?.coins && <span style={{display:'block'}}>Your coins: {details?.coins}</span> }
              <Link href={`/subscriptionModal/${session?.user?.role}`} className={styles.summary}>Buy coins</Link>
              {/* <details className={styles.details}>
              <summary className={styles.summary}>What are coins ?</summary>
              <div className={styles.detailsDiv}>
                <h1 className={styles.howItWorksTitle}>What coins are</h1>
                <ul className={styles.list1}>
                  <li>Coins are virtual tokens that enable you to apply for jobs.</li>
                  <li>You are freely given 30 coins upon registering to get you started.</li>
                  <li>Each job you apply for costs <strong>5 coins</strong>.</li>
                  <li>You <strong>cannot</strong> apply for a job without at <strong>least 5 coins!</strong></li>
                </ul>
                <h1 className={styles.buyCoins}>Buy coins here</h1>
              </div>
            </details> */}
            </div>
          </div>
        </aside>
        <div>
          {details?.cv ? (
            <div className={styles.cv}>
              <div>
                <h4>About You</h4>
                <p>{details?.cv.about}</p>
              </div>
              <div>
                <h4>Education</h4>
                <p>{details?.cv.education}</p>
              </div>
              <div>
                <h4>work Experience</h4>
                <p>{details?.cv.workExperience}</p>
              </div>
              <div>
                <h4>Skills</h4>
                {skills?.map((skill, idx) => (
                  <small key={idx} className={styles.skill}>
                    {skill}
                  </small>
                ))}
              </div>
            </div>
          ): <p>Write your cv! It will help you land a job much easier if you have it!</p> }
          {cvPosted && <p>Your CV has been posted successfully.</p> }
          {errPostingCV && <p>There was an error posting your CV! Please try again.</p> }
        </div>
        
        {!update ? <button onClick={()=> setUpdate(true)}>{details?.cv ? 'Update CV' : 'Write CV'}</button>
        : <div>
          <h3>Your Profile</h3>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              <label htmlFor="about">About you</label>
              <textarea
                className={styles.textarea}
                onChange={handleChange}
                value={formValues.about}
                required
                id="about"
                name="about"
                placeholder="E.g., UI Designer"
              />
            </div>
            <div>
              <label htmlFor="education">Education</label>
              <textarea
                className={styles.textarea}
                onChange={handleChange}
                value={formValues.education}
                required
                id="education"
                name="education"
                placeholder="Add your education details"
              />
            </div>
            <div>
              <label htmlFor="workExperience">Work Experience</label>
              <textarea
                className={styles.textarea}
                onChange={handleChange}
                value={formValues.workExperience}
                required
                id="workExperience"
                name="workExperience"
                placeholder="Have you worked on a project before?"
              />
            </div>
            <div>
              <label htmlFor="skills">Skills</label>
              <textarea
                className={styles.textarea}
                onChange={handleChange}
                value={formValues.skills}
                required
                id="skills"
                name="skills"
                placeholder="Your skills"
              />
            </div>
            <button type="submit">{loading ? 'Saving CV ...' : 'Save'}</button>
          </form>
        </div>}
        {update && <button onClick={()=> setUpdate(false)}>Cancel</button>}
      </section>
      {error && <p>You have not applied for any jobs.</p>}
      <section className={styles.rightSection}>
        <div>
          <h3 className={styles.appliedJobs}>Applied Jobs</h3>

          {details?.appliedJobs?.length === 0 && (
            <>
              <p className={styles.noPostText}>You have not applied for any jobs!</p>
              <div className={styles.howItWorksWrapper}>
                <div className={styles.howItWorks}>
                  <h1 className={styles.howItWorksTitle}>How to apply for a job?</h1>
                  <span>It&apos;s super easy! In only 4 steps:</span>
                  <ul className={styles.list}>
                    <li>
                      Make sure you have at least 5 coins. If not,{" "}
                      <Link className={styles.buyCoins} href={`/subscriptionModal/${session?.user?.role}`}>buy coins here</Link>
                    </li>
                    <li>Click on the 'All jobs' button in the navbar.</li>
                    <li>Click on a job you want. You'll be redirected to an apply page.</li>
                    <li>Apply</li>
                  </ul>
                  <span>It&apos;s that easy!</span>
                </div>
                <div className={styles.whatAreCoins}>
                  <h1 className={styles.howItWorksTitle}>What are coins?</h1>
                  <ul className={styles.list}>
                    <li>
                      Coins are virtual tokens that enable you to apply for jobs.
                    </li>
                    <li>You need 5 coins to apply for a job.</li>
                  </ul>
                  <span>
                    Toggle the <strong>What are coins</strong> for more
                    information
                  </span>
                </div>
              </div>
            </>
          )}

          {details?.appliedJobs?.map((job) => (
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
                      <span className={styles.location}><Icon icon="mdi:location-on-outline" />{job?.locationType} {job?.location}</span>
                      <span className={styles.type}>{job?.type}</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
