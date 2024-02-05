import { useMemo, useState } from "react"
import { cityList } from "@/cityList";
import styles from './page.module.css'

export default function LocationInput({name, register, setValue}) {

    const [locationSearchInput, setLocationSearchInput] = useState("");
    // Handles the user's location search input.
    const [hasFocus, setHasFocus] = useState(null);

    const onLocationSelected = (location) => {
        setValue(name, location) 
    }

    const cities = useMemo(()=>{

        if(!locationSearchInput.trim()) return [];

        const searchWords = locationSearchInput.split(" ");

        return cityList.map(
            (city) => `${city.name}, ${city.capital}`
            ).filter((city)=>
            city.toLowerCase().startsWith(searchWords[0].toLowerCase()) &&
            searchWords.every(word=>city.toLowerCase().includes(word.toLowerCase())), 
        ).slice(0,5)

    },[locationSearchInput])

  return <div>
    <input 
    {...register(name, {
        onChange: (e) => {onLocationSelected}
    })}
    onChange={(e) => setLocationSearchInput(e.target.value)}
    value={locationSearchInput} 
    placeholder="Search for a city"
    type="search"
    name={name}
    onFocus={()=> setHasFocus(true)}
    onBlur={()=> setHasFocus(false)}
    />
    {locationSearchInput.trim() && hasFocus && (
        <div>
            {!cities.length && <p>No such city found</p>}
                {cities.map(city => (
                    <button className={styles.locationBtn} key={city} onMouseDown={(e)=>{
                        e.preventDefault();
                        onLocationSelected(city);
                        setLocationSearchInput("");
                    }}>{city}</button>
                ))}            
        </div>
    )}
  </div>
}
