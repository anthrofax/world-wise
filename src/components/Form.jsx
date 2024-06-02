// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useState, useEffect } from 'react';

import styles from './Form.module.css';
import Button from './Button';
import BackButton from './BackButton';
import useUrlPosition from '../hooks/useUrlPosition';
import Spinner from './Spinner';
import Message from './Message';
import DatePicker from 'react-datepicker';
import { useCities } from '../contexts/CitiesContext';
import {useNavigate} from 'react-router-dom'
import 'react-datepicker/dist/react-datepicker.css';

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

function Form() {
  const [lat, lng] = useUrlPosition();
  const [isLoadingGeocoding, setisLoadingGeocoding] = useState(false);
  const [cityName, setCityName] = useState();
  const [country, setCountry] = useState();
  const [emoji, setEmoji] = useState();
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [geoCodingError, setGeoCodingError] = useState();
  const { addCity, isLoading } = useCities();
  const navigate = useNavigate();

  useEffect(
    function () {
      async function reverseGeocode() {
        try {
          setisLoadingGeocoding(true);
          setGeoCodingError('');

          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();

          if (!data.countryName)
            throw new Error(
              'Area yang anda klik tidak valid, mohon pilih lokasi yang lain.'
            );

          setCityName(data.city || data.locality || '');
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
        } catch (err) {
          setGeoCodingError(err.message);
        } finally {
          setisLoadingGeocoding(false);
        }
      }

      reverseGeocode();
    },
    [lat, lng]
  );

  async function handleAddCity(e) {
    e.preventDefault();

    if (!date || !cityName) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat,
        lng,
      },
    };

    await addCity(newCity);
    navigate("/app/cities");
  }

  if (!lat && !lng)
    return (
      <Message message="Coba mulai dengan klik map untuk mendapatkan lokasi terlebih dahulu."></Message>
    );
  if (geoCodingError) return <Message message={geoCodingError}></Message>;
  if (isLoadingGeocoding) return <Spinner />;

  return (
    <form className={`${styles.form} ${(isLoading ? styles["loading"] : "")}`}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
        id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary" onClick={handleAddCity}>
          Add
        </Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
