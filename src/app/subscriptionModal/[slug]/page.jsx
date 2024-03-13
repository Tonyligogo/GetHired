'use client'
import { Icon } from '@iconify/react'
import styles from './subscription.module.css'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { server } from '@/server'

function page({ params: { slug } }) {

    const [openModal, setOpenModal] = useState(false)
    const [formValues, setFormValues] = useState({
        phone: ""
      });
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedAmount, setSelectedAmount] = useState(0);
    const [numberError, setNumberError] = useState('');

  const handleBuyButtonClick = (plan,amount) => {
    setSelectedPlan(plan);
    setSelectedAmount(amount)
    setOpenModal(true)
    console.log('clicked')
  };
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
       if (openModal && !modalRef?.current?.contains(event.target)) {
          setOpenModal(false);
          console.log('i ran')
      }
      
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openModal]);

    function handleChange(e) {
      setNumberError('')
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
      }
    const phoneNumberRegex = /^(07|01)\d{8}$/;
      
      async function handleSubmit(e){
          e.preventDefault()
          const phoneNumber = formValues.phone; 
        if (phoneNumberRegex.test(phoneNumber)) {
          const data = {
            phone:formValues.phone,
            amount:1
          }
          try {
            await axios.post(`${server}stk`,data)
          } catch (error) {
            console.log(error, 'error sending mpesa stuff')
          }
        } else {
          setNumberError('Invalid phone number')
          const timeoutId = setTimeout(() => {
            setNumberError('')
            setFormValues({...formValues,'phone':''})
          }, 1000); 
    
          return () => {
            clearTimeout(timeoutId);
          };
        }
      }
  return (
    <main className={styles.pricingContainer}>
        <div className={styles.pricingHeading}>
            <h2>PRICING</h2>
        <p className={styles.servicesText}>Choose the subscription plan that best fits your needs</p>
        </div>
        <div className={styles.packages}>
            <div className={styles.package}>
                <h4>Monthly Plan</h4>
                <span className={styles.price}> <sup>Ksh</sup>1000</span>
                <span className={styles.timeSpan}>per month</span>
                <ul>
                    <li><Icon icon="teenyicons:tick-small-outline"  color="#28a745"  width="24"/> Get 50 monthly coins</li>
                    <li className={styles.lineThrough}><Icon icon="bi:x"   width="24"/> Unlimited coins</li>
                </ul>
                <button className={styles.btnOutline} onClick={() => handleBuyButtonClick('monthly',1000)}>Buy</button>
            </div>
            <div className={`${styles.package} ${styles.activePackage}`}>
                <h4>Unlimited Monthly Plan</h4>
                <span className={styles.price}> <sup>Ksh</sup>2000</span>
                <span className={styles.timeSpan}>per month</span>
                <ul>
                    <li><Icon icon="teenyicons:tick-small-outline"  color="#28a745"  width="24"/> Get unlimited monthly coins</li>
                </ul>
                <button className={styles.btnOutline} onClick={() => handleBuyButtonClick('Unlimited Monthly',2000)}>Buy</button>
            </div>
            <div className={styles.package}>
                <h4>Yearly Plan</h4>
                <span className={styles.price}> <sup>Ksh</sup>9000</span>
                <span className={styles.timeSpan}>per year</span>
                <ul>
                    <li><Icon icon="teenyicons:tick-small-outline"  color="#28a745"  width="24"/> Yearly unlimited coins</li>
                </ul>
                <button className={styles.btnOutline} onClick={() => handleBuyButtonClick('Yearly',9000)}>Buy</button>
            </div>
            <div className={`${styles.package} ${styles.lastPackage}`}>
                <h4>Custom Plan</h4>
                <ul>
                    <li><Icon icon="teenyicons:tick-small-outline"  color="#28a745"  width="24"/> Set your own amount.</li>
                    <li><Icon icon="teenyicons:tick-small-outline"  color="#28a745"  width="24"/> Get coins based on that amount.</li>
                </ul>
                <button className={styles.btnOutline} onClick={() => handleBuyButtonClick('Custom',500)}>Get Started</button>
            </div>
        </div>

        {openModal && <div className={styles.mpesaModal} ref={modalRef}>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
      <h3 className={styles.title}>Buy the {selectedPlan} package</h3>
      <span style={{fontSize:'20px', fontWeight:'500', cursor:'pointer'}} onClick={()=>setOpenModal(false)}> &times; </span>
          </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label className={styles.label}>
            Make a payment of {selectedAmount} KES
          </label>
        </div>

        <div >
          <label className={styles.label} >
            Enter your phone number
          </label>
          <input
            type="number"
            name="phone"
            required
            value={formValues.phone}
            onChange={handleChange}
            id="phone"
            placeholder="07********,01********"
            className={styles.phoneNumber}
          />
        </div>
        {numberError && <p style={{color:'red', paddingBlock:'2px'}} >! {numberError}</p> }
        <div>
          <input
            type="submit"
            value="Pay now"
            className={styles.payBtn}
          />
        </div>
      </form>
      {/* {paymentMade && (
        <>
          <div className="w-full mt-1 relative mb-1">
            <label className={styles.label}>
              Click the button below after you have responded to the mpesa pop-up. 
            </label>
            <div className="w-full mt-5">
              <input
                type="button"
                value="Confirm payment status"
                className={styles.button}
                onClick={checkMpesaPaymentStatus}
              />
            </div>
          </div>
        </>
      )} */}
        </div>}
    </main>
  )
}

export default page