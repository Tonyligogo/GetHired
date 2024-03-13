import axios from 'axios';
import Review from '../review/Review';
import styles from './Reviews.module.css'
import { server } from '@/server';
const Reviews = () => {

  const handleSubmit = async(e) => {
    e.preventDefault();
    const review = e.target[0].value;
    const star = e.target[1].value;
    const data = {review, star}
    try {
       await axios.post(`${server}review/createReview/${jobseekerId}/${employerId}`, data) 
    } catch (error) {
        console.log(error,'Error creating review')
    }
  };

  return (
    <div className={styles.reviews}>
      <h2>Reviews</h2>
      {/* {data.map((review) => <Review key={review._id} review={review} />)} */}
      <div className={styles.add}>
        <h3>Add a review</h3>
        <form className={styles.addForm} onSubmit={handleSubmit}>
          <input className={styles.input} type="text" placeholder="write your opinion" />
          <select className={styles.select}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          <button className={styles.button}>Send</button>
        </form>
      </div>
    </div>
  );
};

export default Reviews;