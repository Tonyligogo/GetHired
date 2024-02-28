"use client";

import { signIn } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { Icon } from "@iconify/react";
import { redirect, useRouter } from "next/navigation";
// import toast from "react-hot-toast";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { server } from "@/server";
// import { useUserContext } from '@/app/context/Userprovider';

function Login() {
  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      redirect("/");
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
  const router = useRouter();

  useEffect(() => {
    userRef.current.focus();
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
      <div className={styles.form}>
        <h2 className={styles.title}>Sign in to GetHired</h2>
        <span
          className={styles.google}
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <Image
            width={24}
            height={24}
            src="https://freelogopng.com/images/all_img/1657955079google-icon-png.png"
            alt="google logo"
          />
          Sign in with Google
        </span>
        <p className={styles.line}>
          <small className={styles.inlineText}>or sign in with email</small>
        </p>
        <form onSubmit={handleLogin}>
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
          {loading ? (
            <button className={styles.signIn}>
              {/* <CircularProgress size="14px" className={styles.progress}/> */}
              Signing in...
            </button>
          ) : (
            <button className={styles.signIn}>Sign in</button>
          )}
          <Link href="/register" className={styles.registerLink}>
            Create an account
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
