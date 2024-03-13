"use client";

import { signIn } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { CircularProgress } from "@mui/material";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import Link from "next/link";

function Login() {
  const {status, data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if(status !== 'loading'){
      if (session) {
        router.back();
      }
    }
  }, [session]);

  const userRef = useRef();
  const passwordRef = useRef();
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [, setUserFocus] = useState(false);
  const [passwordType, setPasswordType] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    const data = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
    };
    try {
      const res = await signIn("credentials", {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        password: formValues.password,
        redirect: false,
      });
      if (res.error) {
        console.log("invalid credentials", res.error);
        setError("Invalid credentials");
        setLoading(false);
        return;
      }
      setLoading(false);
      router.replace("/");
    } catch (error) {
      setLoading(false);
      setError("An error occured while signin in. Please try again!");
      console.log(error, "this is from login page");
    }
  }

  return (
    <div className={styles.loginPage}>
      {(status !=='loading' && !session?.user) && <div className={styles.form}>
         <h2 className={styles.title}>Sign in to GetHired</h2>
        <form onSubmit={handleLogin}>
          <div className={styles.inputBox}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              className={styles.input}
              id="email"
              type="emial"
              value={formValues.email}
              name="email"
              autoComplete="off"
              required
              ref={userRef}
              onFocus={() => setUserFocus(true)}
              onChange={handleChange}
            />
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
          {error !== "" && <p className={styles.errorMsg}>{error}</p>}
            <button className={styles.signIn}>{loading ?'Signing in...': 'Sign in'}</button>
          <Link href="/register" className={styles.registerLink}>
            Create an account
          </Link>
        </form>
      </div>}
    </div>
  );
}

export default Login;
