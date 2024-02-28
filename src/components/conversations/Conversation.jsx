"use client";

import styles from "./conversation.module.css";
import { useSession } from "next-auth/react";

export default function Conversation({conversation, notificationCounts}) {
  const {data:session} = useSession()
  const userId = session?.user?.id;
  return (
    // <div className={styles.conversation} key={conversation._id}>
    //   {conversation?.employerId === userId && 
    //     <span className={styles.conversationName}>
    //       {conversation?.jobSeekerId?.firstName} {conversation?.jobSeekerId?.lastName}
    //     </span>
    //   }
    //   {conversation?.jobSeekerId === userId && 
    //     <span className={styles.conversationName}>
    //       {conversation?.employerId?.firstName} {conversation?.employerId?.lastName}
    //     </span>
    //   }
    // </div>
    <div className={styles.conversation} key={conversation._id}>
      {conversation?.employerId === userId && (
        <span className={styles.conversationName}>
          {conversation?.jobSeekerId?.firstName} {conversation?.jobSeekerId?.lastName}
          {notificationCounts[conversation?.jobSeekerId?._id] > 0 && (
            <span className={styles.notificationCount}>
              {notificationCounts[conversation?.jobSeekerId?._id]}
            </span>
          )}
        </span>
      )}
      {conversation?.jobSeekerId === userId && (
        <span className={styles.conversationName}>
          {conversation?.employerId?.firstName} {conversation?.employerId?.lastName}
          {notificationCounts[conversation?.employerId?._id] > 0 && (
            <span className={styles.notificationCount}>
              {notificationCounts[conversation?.employerId?._id]}
            </span>
          )}
        </span>
      )}
    </div>
  );
}
