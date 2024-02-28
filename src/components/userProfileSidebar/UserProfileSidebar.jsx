// 'use client'
import styles from "./UserProfile.module.css";
import dummyProfile from "../../../public/userProfileDummy.jpg";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.js";
// import { useSession } from 'next-auth/react'
// import { useUser, currentUser } from "@clerk/nextjs";

export default async function UserProfileSidebar() {
  const session = await getServerSession(authOptions);

  return (
    <aside className={styles.container}>
      <div className={styles.user}>
        <div>
          {session?.user?.image !== undefined ? (
            <Image
              src={session?.user?.image}
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
          <h2 className={styles.name}>
            {session?.user?.firstName} {session?.user?.lastName}
          </h2>
        </div>
        <div>
          {session?.user?.role === "JobSeeker" && (
            <Link href={`/jobSeeker/${session?.user?.id}`}>
              <button className={styles.btn}>View Profile</button>
            </Link>
          )}
          {session?.user?.role === "Employer" && (
            <Link href={`/employer/${session?.user?.id}`}>
              <button className={styles.btn}>View Profile</button>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
