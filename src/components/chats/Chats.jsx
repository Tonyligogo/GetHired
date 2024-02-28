"use client";

import styles from "./chats.module.css";
import { formatDistanceToNow} from 'date-fns';

export default function Chats({ own, message }) {

  return (
  <div className={own ? `${styles["message"]} ${styles["own"]}`: styles.message}>
    <div className={styles.messageTop}>
      <p className={styles.messageText}>{message?.content}</p>
    </div>
    <div className={styles.messageBottom}>{formatDistanceToNow(new Date(message?.createdAt), {
              addSuffix: true,
            })}</div>
  </div>
);
};