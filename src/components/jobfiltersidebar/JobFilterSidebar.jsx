import { jobTypes } from '@/jobTypes'
import Select from '../ui/Select'
import styles from './page.module.css'
import { jobFilterSchema } from '@/lib/formValidation'
import { redirect } from 'next/navigation'
import FormSubmitButton from '../FormSubmitButton'

async function filterJobs(formData){
  'use server'
  const values = Object.fromEntries(formData.entries())

  const {q, type, location, remote} = jobFilterSchema.parse(values)

  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
    ...(type && { type }),
    ...(location && { location }),
    ...(remote && { remote: "true" }),
  })

  redirect(`/?${searchParams.toString()}`)

}

export default async function JobFilterSidebar({defaultValues}) {

  const locations = await fetch('https://jsonplaceholder.typicode.com/users')
  .then(res => res.json())
    
  return (
    <aside className={styles.sidebar}>
      <form action={filterJobs} className={styles.form} key={JSON.stringify(defaultValues)}>
        <div className={styles.searchBar}>
          <label className={styles.label} htmlFor='q'>Search</label>
          <input id='q' name='q' placeholder='Title, company, etc' className={styles.searchInput} defaultValue={defaultValues.q || ''}/>
        </div>
        <div>
          <label className={styles.label} htmlFor='type'>Type</label>
          <select id='type' name='type' defaultValue={defaultValues.type || ''} className={styles.select}>
            <option value="">All types</option>
            {jobTypes.map((jobType,idx) => (
                <option key={idx}>{jobType}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={styles.label} htmlFor='location'>Location</label>
          <Select id='location' name='location' defaultValue={defaultValues.location || ''} options={locations} className={styles.select}/>
        </div>
        <div className={styles.checkbox}>
          <input type="checkbox" name="remote" id="remote" defaultChecked={defaultValues.remote} />
          <label className={styles} htmlFor='remote'>Remote jobs</label>
        </div>
        <FormSubmitButton className={styles.filterBtn}>Filter Jobs</FormSubmitButton>
      </form>
    </aside>
  )
}
