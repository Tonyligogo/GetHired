"use client";
import { createJobSchema } from "@/lib/formValidation";
import styles from "./page.module.css";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobTypes, locationTypes } from "@/jobTypes";
import { draftToMarkdown } from "markdown-draft-js";

import { useEffect, useMemo, useState } from "react";
import { cityList } from "@/cityList";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/navigation";
import { server } from "@/server";
import { useSession } from "next-auth/react";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

export default function CreateJobForm() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.role !== "Employer") {
      router.push("/");
    }
  }, []);
  const userId = session?.user?.id;
  const form = useForm({
    resolver: zodResolver(createJobSchema),
  });

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    control,
    setValue,
    setFocus,
    setError,
    reset,
    formState: { isSubmitting, errors },
  } = form;

  const [locationSearchInput, setLocationSearchInput] = useState("");
  // Handles the user's location search input.
  const [hasFocus, setHasFocus] = useState(null);

  const onLocationSelected = (location) => {
    setValue("location", location);
  };

  const cities = useMemo(() => {
    if (!locationSearchInput.trim()) return [];

    const searchWords = locationSearchInput.split(" ");

    return cityList
      .map((city) => `${city.name}, ${city.capital}`)
      .filter(
        (city) =>
          city.toLowerCase().startsWith(searchWords[0].toLowerCase()) &&
          searchWords.every((word) =>
            city.toLowerCase().includes(word.toLowerCase())
          )
      )
      .slice(0, 5);
  }, [locationSearchInput]);

  const onSubmit = async (values) => {
    const data = {
      title: values.title,
      type: values.type,
      companyName: values.companyName,
      locationType: values.locationType,
      salary: values.salary,
      location: values.location,
      description: values.description,
      requirements: values.requirements,
    };
    try {
      await axios
        .post(`${server}employer/createPost/${userId}`, data)
        .then(() => {
          router.push("/job-submitted");
        });
    } catch (error) {
      console.log(error, "This error is in createjobform");
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.heading}>
        <h1>Find your perfect developer</h1>
        <span className={styles.subheading}>
          Get your job posting seen by thousands of job seekers
        </span>
      </div>
      <div className={styles.formWrapper}>
        <div>
          <h3>Job details</h3>
          <span className={styles.subheading}>
            Provide a job description and details
          </span>
        </div>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
        >
          <div>
            <label htmlFor="title">Title</label>
            <input
              {...register("title")}
              id="title"
              placeholder="e.g. Frontend Developer"
            />
            {errors.title?.message && <p>{errors.title?.message}</p>}
          </div>
          <div>
            <label className={styles.label} htmlFor="type">
              Type
            </label>
            <select
              {...register("type")}
              id="type"
              defaultValue=""
              className={styles.select}
            >
              <option value="" hidden>
                Select an option
              </option>
              {jobTypes.map((jobType, idx) => (
                <option key={idx}>{jobType}</option>
              ))}
            </select>
            {errors.type?.message && <p>{errors.type?.message}</p>}
          </div>
          <div>
            <label htmlFor="companyName">Company name</label>
            <input
              {...register("companyName")}
              id="companyName"
              placeholder="Your company name"
            />
            {errors.companyName?.message && (
              <p>{errors.companyName?.message}</p>
            )}
          </div>
          <div>
            <label className={styles.label} htmlFor="locationType">
              Location
            </label>
            <select
              {...register("locationType", {
                onChange: (e) => {
                  trigger("location");
                },
              })}
              id="locationType"
              name="locationType"
              defaultValue=""
              className={styles.select}
            >
              <option value="" hidden>
                Select a location
              </option>
              {locationTypes.map((location, idx) => (
                <option key={idx}>{location}</option>
              ))}
            </select>
            {errors.locationType?.message && (
              <p>{errors.locationType?.message}</p>
            )}
          </div>
          <div>
            <input
              {...register("location", {
                onChange: (e) => {
                  onLocationSelected;
                },
              })}
              onChange={(e) => setLocationSearchInput(e.target.value)}
              value={locationSearchInput}
              placeholder="Search for a city"
              type="search"
              onFocus={() => setHasFocus(true)}
              onBlur={() => setHasFocus(false)}
            />
            {locationSearchInput.trim() && hasFocus && (
              <div>
                {!cities.length && <p>No such city found</p>}
                {cities.map((city) => (
                  <button
                    className={styles.locationBtn}
                    key={city}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onLocationSelected(city);
                      setLocationSearchInput("");
                    }}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
            {watch("location") && watch("location")}
          </div>
          <div>
            <label htmlFor="requirements">Requirements</label>
            <input
              {...register("requirements")}
              id="requirements"
              placeholder="Describe your requirements for the job"
            />
            {errors.requirements?.message && (
              <p>{errors.requirements?.message}</p>
            )}
          </div>
          <div>
            <label onClick={() => setFocus("description")}>Description</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Editor
                  {...field}
                  onChange={(draft) => field.onChange(draftToMarkdown(draft))}
                  editorStyle={{
                    border: "1px solid lightGrey",
                    borderRadius: "4px",
                    paddingInline: "8px",
                    minHeight: "140px",
                    cursor: "text",
                  }}
                  toolbar={{
                    options: ["inline", "list", "link", "history"],
                    inline: {
                      options: ["bold", "italic", "underline"],
                    },
                  }}
                />
              )}
            />

            {watch("description") && watch("description")}
          </div>
          <div>
            <label htmlFor="salary">Salary</label>
            <input {...register("salary")} id="salary" type="number" />
            {errors.salary?.message && <p>{errors.salary?.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Loading..." : "Submit"}
          </button>
          {errors.root?.message && <p>{errors.root?.message}</p>}
        </form>
      </div>
    </main>
  );
}
