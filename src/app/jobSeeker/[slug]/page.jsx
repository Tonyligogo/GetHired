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

export default function page({ params: { slug } }) {
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(false);
  const [update, setUpdate] = useState(false);
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
        fetchDetails();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
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
                src={details?.user?.image}
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
              {details?.cv && <span className={styles.text}>{details?.cv?.about}</span>}
            </div>
          </div>
          <Link href="/messenger">Conversations</Link>
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
            <button type="submit">Save</button>
          </form>
        </div>}
        {update && <button onClick={()=> setUpdate(false)}>Cancel</button>}
      </section>
      {error && <p>No details for you buddy</p>}
      <section className={styles.rightSection}>
        <div>
          <h3 className={styles.appliedJobs}>Applied Jobs</h3>
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
