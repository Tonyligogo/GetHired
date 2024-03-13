"use client";
import { useEffect, useState } from "react";
import styles from "./JobSeeker.module.css";
import axios from "axios";
import { server } from "@/server";
import { useRouter } from "next/navigation";

export default function JobSeeker({ jobSeeker, employerId }) {
    const router = useRouter()
  const [skills, setSkills] = useState([]);
  useEffect(() => {
    const skillsArray = jobSeeker?.cv?.skills[0]
      ?.split(",")
      .map((skill) => skill.trim());
    setSkills(skillsArray);
  }, []);

  async function handleOpenMessagePanel(e) {
    e.preventDefault();
    try {
      await axios
        .post(`${server}conversation/createConversation/${employerId}/with/${jobSeeker.user._id}`)
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
    }
  }

  return (
    <div key={jobSeeker.user._id} className={styles.wrapper}>
      <span>
        {jobSeeker.user?.firstName} {jobSeeker.user?.lastName}
      </span>
      <div>
        <p style={{marginTop:'5px'}}>About: <small style={{color:'rgb(42, 42, 42)'}}>{jobSeeker.cv?.about}</small></p>
        <p style={{marginTop:'5px'}}>Education: <small style={{color:'rgb(42, 42, 42)'}}>{jobSeeker.cv?.education}</small></p>
        <p style={{marginTop:'5px', marginBottom:'5px'}}>My Work experience: <small style={{color:'rgb(42, 42, 42)'}}>{jobSeeker.cv?.workExperience}</small></p>
        <span>My skills:</span>
        <div className={styles.skillsContainer}>
          {skills?.map((skill, idx) => (
            <small key={idx} className={styles.skill}>
              {skill}
            </small>
          ))}
        </div>
      </div>
      <button onClick={handleOpenMessagePanel} className={styles.contactBtn}>Contact</button>
    </div>
  );
}
