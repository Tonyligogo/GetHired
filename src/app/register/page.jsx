"use client"
import { signIn } from 'next-auth/react'
import React, { useEffect, useRef, useState} from "react";
import styles from './page.module.css';
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation'
// import toast from "react-hot-toast";
import Image from 'next/image';
// import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { server } from '@/server';
// import { useUserContext } from '@/app/context/Userprovider';

function Login() {

  const userRef = useRef();
  const passwordRef = useRef();
  const [formValues, setFormValues] = useState({username:'',email:"",password:''});
  const [, setUserFocus] = useState(false);
  const[passwordType, setPasswordType] = useState(true); 
  const[loading, setLoading] = useState(false); 
  const router = useRouter()
  // const {setUser} = useUserContext()

  useEffect(()=>{
    userRef.current.focus();
  },[]);

  function handleChange(e){
    setFormValues({...formValues, [e.target.name]:e.target.value})
  }
  function showPassword(e){
    e.preventDefault()
    setPasswordType((prev)=>!prev)
  }
  // const {status} = useSession()
  // useEffect(()=>{
  //   if(status === 'authenticated'){
  //     router.push('/')
  //   }
  // },[status, router])
  async function handleRegister(e){
    e.preventDefault();
    setLoading(true)
    const data = {username:formValues.username, email:formValues.email, password:formValues.password};
    await axios.post(`${server}auth/register`, data)
    .then((res) => {
      // setUser(res?.data?.username)
      setFormValues({username:'', email: '',password:''})
      router.replace('/login')
    }).catch((err) => {
      if(err?.response?.status === 404){
        //   toast.error('User not found', {
        //     id: 'error',
        // })
        console.log('error should be here')
      }
      else if(err?.response?.status === 400){
        //   toast.error('Wrong username or password', {
        //     id: 'error',
        // })
      }else{
        console.log(err)
      //   toast.error('Login failed. Try again!', {
      //     id: 'error',
      // })
      }
    }) 
    .finally(() => {
      setLoading(false);
    });
  }
  const loginWithGoogle = () => {
    signIn("google", {callbackUrl: "/"})
    router.replace('/');
  }
 
  return (
      <div className={styles.loginPage}>
      <div className={styles.form}>    
                  <h2 className={styles.title}>Sign up to GetHired</h2>
                  <span className={styles.google} onClick={loginWithGoogle}> <Image width={24} height={24} src="https://freelogopng.com/images/all_img/1657955079google-icon-png.png" alt="google logo" /> Sign up with Google</span>
                  <p className={styles.line}> <small className={styles.inlineText}>or sign up with email</small> </p>
                  <form onSubmit={handleRegister}>
                    <div className={styles.inputBox}>
                      <label htmlFor="username" className={styles.label}>Username</label>
                      <input 
                        className={styles.input}
                        id="username"
                        type="text" 
                        value={formValues.username} 
                        ref={userRef} 
                        name="username"
                        autoComplete="off" 
                        onFocus={()=>setUserFocus(true)}
                        required 
                        onChange={handleChange}
                      />
                    </div>
                    <div className={styles.inputBox}>
                      <label htmlFor="email" className={styles.label}>Email</label>
                      <input 
                        className={styles.input}
                        id="email"
                        type="text" 
                        value={formValues.email} 
                        name="email"
                        autoComplete="off" 
                        required 
                        onChange={handleChange}
                      />
                    </div>
                      <div className={styles.inputBox}>
                        <div className={styles.passIcon}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        {passwordType ?
                        <Icon icon="basil:eye-closed-outline" width="28" color="rgb(109, 109, 109)" onClick={showPassword}/>
                        : <Icon icon="basil:eye-outline" width="28" color="rgb(109, 109, 109)" onClick={showPassword}/>}
                        </div>
                        <input 
                          className={styles.input}
                          id="password"
                          type={passwordType ? 'password' : 'text'} 
                          value={formValues.password}
                          name="password" 
                          required 
                          onChange={handleChange}
                          ref={passwordRef}
                        />
                      </div>
                    {loading ? 
                    <button className={styles.signIn}>
                      {/* <CircularProgress size="14px" className={styles.progress}/> */}
                      Signing up...
                      </button>
                    :
                    <button className={styles.signIn}>Sign up</button>}
                    <Link href='/login' className={styles.registerLink}>Sign in</Link>
                  </form> 
              </div>
    </div>
  )
}

export default Login