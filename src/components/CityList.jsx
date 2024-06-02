import styles from './CityList.module.css';
import CityItem from './CityItem';
import Spinner from './Spinner'
import { useCities } from '../contexts/CitiesContext';


function CityList() {
const {isLoading, cities} = useCities();

  if(isLoading) return <Spinner/>

  if (cities.length === 0) return;

  return <ul className={styles.cityList}>
    {cities.map(city => <CityItem city={city} key={city.id}/>)}
  </ul>;
}

export default CityList;
