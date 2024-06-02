import styles from './CountryList.module.css';
import CountryItem from './CountryItem';
import Spinner from './Spinner';
import { useCities } from '../contexts/CitiesContext';

function CountryList() {
  const {isLoading, cities} = useCities();
  
  if (isLoading) return <Spinner />;

  if (cities.length === 0) return;

//   1. My first way (Unefficient way)
//   const uniqueCountry = [];

//   cities.forEach((city) => {
//     const unik = uniqueCountry.map((country) => country.country);

//     if (!unik.includes(city.country))
//       uniqueCountry.push({ country: city.country, emoji: city.emoji });
//   });

  //   2. Jonas' way
  const countries = cities.reduce((arr, city) => {
      if (!arr.map(el => el.country).includes(city.country)) return [...arr, {country: city.country, emoji: city.emoji}]
      else return arr;
  }, []);

// 3. My way - Set Usage (Not work yet - Needs to find way, is this way could work)
// const countries = [...new Set(cities.map(city => city.country)) ];

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountryList;
