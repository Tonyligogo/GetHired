"use client";

import styles from "./messages.module.css";

export default function Messages({ id, user, messages }) {

  return (
    <div className={styles.wrapper}>
      {messages?.map((message) => {
        const isUserOwner = message.userId === user;
        // Determine the className based on whether the user is the owner of the message
        const className = isUserOwner ? styles.owner : styles.foreign;
        return (
          <div key={message._id} className={className}>
            <p>
            {isUserOwner ? (
              <span className={styles.content}>{message.content}</span>
            ) : (
              <span>{message.content}</span>
            )}
            {isUserOwner && <small className={styles.meText}>Me</small>}
            </p>
          </div>
        );
      })}
    </div>
  );
}
