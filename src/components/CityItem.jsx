import { Link } from 'react-router-dom';
import styles from './CityItem.module.css';
import { useCities } from '../contexts/CitiesContext';
import Spinner from './Spinner';

const formatDate = (date) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));

function CityItem({ city }) {
  // eslint-disable-next-line
  const {
    emoji,
    cityName,
    date,
    position: { lat, lng },
  } = city;

  const { currentCity, deleteCity, isLoading } = useCities();

  function handleDeleteCity(e) {
    e.preventDefault();

    deleteCity(city.id);
  }

  if (isLoading) return <Spinner />;

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          currentCity.id === city.id ? styles['cityItem--active'] : ''
        }`}
        to={`${city.id}?lat=${lat}&lng=${lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <span className={styles.name}>{cityName}</span>
        <span className={styles.date}>{formatDate(date)}</span>
        <button className={styles.deleteBtn} onClick={handleDeleteCity}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
