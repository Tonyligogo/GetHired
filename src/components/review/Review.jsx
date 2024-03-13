import styles from './Review.module.css'
import { Icon } from "@iconify/react";

const Review = ({ review }) => {

  return (
    <div className={styles.review}>
      
        <div className={styles.user}>
          <img className={styles.pp} src={data.img || "/img/noavatar.jpg"} alt="" />
          <div className={styles.info}>
            <span>{data.username}</span>
            <div className={styles.country}>
              <span>{data.country}</span>
            </div>
          </div>
        </div>
      
      <div className={styles.stars}>
        {Array(review.star)
          .fill()
          .map((item, i) => (
            <Icon icon="material-symbols-light:star" width="1.2rem" height="1.2rem"  style={{color: 'yellow'}} />
          ))}
        <span className={styles.starNumber}>{review.star}</span>
      </div>
      <p>{review.desc}</p>
    </div>
  );
};

export default Review;