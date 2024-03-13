"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";
import axios from "axios";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { server } from "@/server";
import { categoryList } from "@/categoryList";


function Login() {
  const userRef = useRef();
  const passwordRef = useRef();
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName:"",
    email: "",
    password: ""
  });
  const [role, setRole] = useState(''); 
  const [, setUserFocus] = useState(false);
  const [passwordType, setPasswordType] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [file, setFile] = useState('');
  const [categorySearchInput, setCategorySearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [hasFocus, setHasFocus] = useState(null);
  
  const router = useRouter();

  useEffect(() => {
    userRef?.current?.focus();
  }, []);

  function handleChange(e) {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  }
  function showPassword(e) {
    e.preventDefault();
    setPasswordType((prev) => !prev);
  }
  // const {status} = useSession()
  // useEffect(()=>{
  //   if(status === 'authenticated'){
  //     router.push('/')
  //   }
  // },[status, router])

  const categories = useMemo(() => {
    if (!categorySearchInput.trim()) return [];
  
    const searchWords = categorySearchInput.trim().toLowerCase().split(" ");
  
    return categoryList
      .filter((category) =>
        searchWords.every((word) =>
          category.toLowerCase().includes(word.toLowerCase())
        )
      )
      .slice(0, 5);
  }, [categorySearchInput, categoryList]);

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
        const {firstName, lastName, email, password} = formValues
        data.set('firstName', firstName);
        data.set('lastName', lastName);
        data.set('email', email);
        data.set('niche', selectedCategory);
        data.set('password', password);
        data.set('image', file[0]);
        data.set('role',role)

    await axios
      .post(`${server}auth/register`, data)
      .then(() => {
        router.replace("/login");
      })
      .catch((err) => {
        if (err?.response?.status === 404) {
          console.log("error should be here");
        } else if (err?.response?.status === 400) {
        } else {
          console.log(err);
        }
      })
      .finally(() => {
        setFormValues({ firstName: "", lastName:"", email: "", password: ""});
        setSelectedCategory("");
        setRole("");
        setFile("");
        setLoading(false);
      });
  }
  return (
    <div className={styles.loginPage}>
      {!formOpen
      ?
      <div className={styles.pageContainer}>
        <h2 className={styles.title1}>Join as an employer or job-seeker</h2>
        <div className={styles.pageWrapper}>
          <div className={styles.preRegisterWrapper}>
            <div className={styles.bigBtns}>
            <span onClick={()=>setRole('JobSeeker')} className={ role === 'JobSeeker' ? styles.userBtnSelected : styles.userBtn}>Job Seeker</span>
            <span onClick={()=>setRole('Employer')} className={ role === 'Employer' ? styles.userBtnSelected : styles.userBtn}>Employer</span>
            </div>
            <div className={styles.accountBtn}>
            {role === '' ? <button disabled className={styles.notAllowed}>Create Account</button> :
            <button onClick={()=>setFormOpen(true)} className={styles.allowed}>{role === 'JobSeeker' ? 'Create Account as a job-seeker' : 'Create Account as an employer'}</button>}
            </div>
            <p className={styles.redirectToLogin}>
                Already have an account?{' '}
              <Link href="/login" className={styles.registerLink}>
                Log in
              </Link>
            </p>
          </div>
          <div className={styles.howItWorksWrapper}>
                  <div className={styles.howItWorks}>
                    <h2 className={styles.howItWorksTitle}><Icon icon="noto-v1:light-bulb" width="1.2rem" height="1.2rem" /> Important note</h2>
                    <h3 className={styles.howItWorksTitle1}><Icon icon="mdi:tick-circle" width="1.5rem" height="1.5rem" />GetHired uses coins to enable you to post and apply for jobs.</h3>
                    <h3 className={styles.howItWorksTitle1}><Icon icon="mdi:tick-circle" width="1rem" height="1rem" /> What are coins?</h3>
                    <ul className={styles.list}>
                      <li>Coins are a must-have virtual tokens that enable you to post or apply for jobs.</li>
                    </ul>
                    <h3 className={styles.howItWorksTitle1}><Icon icon="mdi:tick-circle" width="1.2rem" height="1.2rem" /> Register now and get 30 free coins to get you started!</h3>
                  </div>
          </div>
        </div>
      </div>
      :
      <div className={styles.form}>
        <h2 className={styles.title}>Sign up to GetHired</h2>
        <form onSubmit={handleRegister}>
          <div className={styles.names}>
            <div className={styles.inputBox}>
              <label htmlFor="firstName" className={styles.label}>
                FirstName
              </label>
              <input
                className={styles.input}
                id="firstName"
                type="firstName"
                value={formValues.firstName}
                ref={userRef}
                name="firstName"
                autoComplete="off"
                onFocus={() => setUserFocus(true)}
                required
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputBox}>
              <label htmlFor="lastName" className={styles.label}>
                LastName
              </label>
              <input
                className={styles.input}
                id="lastName"
                type="lastName"
                value={formValues.lastName}
                name="lastName"
                autoComplete="off"
                required
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={styles.inputBox}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              className={styles.input}
              id="email"
              type="email"
              value={formValues.email}
              name="email"
              autoComplete="off"
              required
              onChange={handleChange}
            />
          </div>
          <div className={styles.selectedCategory}>
          <div className={styles.inputBox}>
            <label htmlFor="industry" className={styles.label}>
              Industry
            </label>
            <input
              className={styles.input}
              onChange={(e) => setCategorySearchInput(e.target.value)}
              value={categorySearchInput}
              placeholder="Search for your industry"
              type="search"
              id="industry"
              onFocus={() => setHasFocus(true)}
              onBlur={() => setHasFocus(false)}
            />
            {categorySearchInput.trim() && hasFocus && (
              <div className={styles.categoryWrapper}>
                {!categories.length && <p>No such industry found</p>}
                {categories.map((category) => (
                  <button
                    className={styles.categoryBtn}
                    key={category}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setSelectedCategory(category)
                      setCategorySearchInput("");
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedCategory !== '' && <div className={styles.inputBox}>
            <span className={styles.selected}>{selectedCategory}</span>
          </div>}
          </div>

          <div style={{ marginBlockEnd:'10px'}}>
            {/* <label htmlFor="file" className={styles.label}>Add your photo</label> */}
            {/* <input type="file" id="file" onChange={e => setFile(e.target.files)}/> */}
            <input style={{ display: "none" }} type="file" id="file" onChange={e => setFile(e.target.files)}/>
                <label htmlFor="file" style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <Icon icon="mage:image-plus" width="2.5rem" height="2.5rem"  style={{color: '#1877f2'}} />
                  <span>Add your photo</span>
                </label>
          </div>
          <div className={styles.inputBox}>
            <div className={styles.passIcon}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              {passwordType ? (
                <Icon
                  icon="basil:eye-closed-outline"
                  width="28"
                  color="rgb(109, 109, 109)"
                  onClick={showPassword}
                />
              ) : (
                <Icon
                  icon="basil:eye-outline"
                  width="28"
                  color="rgb(109, 109, 109)"
                  onClick={showPassword}
                />
              )}
            </div>
            <input
              className={styles.input}
              id="password"
              type={passwordType ? "password" : "text"}
              value={formValues.password}
              name="password"
              required
              onChange={handleChange}
              ref={passwordRef}
            />
          </div>
            <button className={styles.signIn}>{loading ? 'Signing up...' : 'Sign up'}</button>
            <p className={styles.redirectToLogin}>
            Already have an account?{' '}
          <Link href="/login" className={styles.registerLink}>
            Log in
          </Link>
            </p>
        </form>
      </div>}
    </div>
  );
}

export default Login;
