import { useCallback, useReducer } from 'react';
import { useEffect, useContext, createContext } from 'react';

const CitiesContext = createContext();

const initialValue = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: '',
};

const reducer = function (state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };
    case 'cities/loaded':
      return { ...state, isLoading: false, cities: action.payload };
    case 'city/loaded':
      return { ...state, isLoading: false, currentCity: action.payload };
    case 'city/add':
      return {
        ...state,
        currentCity: action.payload,
        cities: [...state.cities, action.payload],
        isLoading: false,
      };
    case 'city/delete':
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
      };
    case 'rejected':
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error('Action type tidak ada.');
  }
};

function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialValue
  );

  const BASE_URL = 'http://localhost:8000';

  useEffect(function () {
    async function getCities() {
      dispatch({ type: 'loading' });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();

        dispatch({ type: 'cities/loaded', payload: data });
      } catch (err) {
        dispatch({ type: 'rejected', payload: err.message });
      }
    }

    getCities();
  }, []);

  const getCity = useCallback(async function getCity(id) {
    if (+id === currentCity.id) return;
    
    dispatch({ type: 'loading' });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();

      dispatch({ type: 'city/loaded', payload: data });
    } catch (err) {
      dispatch({
        type: 'rejected',
        payload: 'Data mengenai city tersebut tidak tersedia.',
      });
    }
  }, [currentCity])

  async function addCity(cityData) {
    dispatch({ type: 'loading' });

    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(cityData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();

      console.log(data);
      dispatch({ type: 'city/add', payload: data });
    } catch (err) {
      dispatch({ type: 'rejected', payload: 'Data city gagal ditambahkan.' });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: 'loading' });

    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });

      dispatch({ type: 'city/delete', payload: id });
    } catch (err) {
      dispatch({ type: 'rejected', payload: 'Data city gagal dihapus.' });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        addCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (!context)
    throw new Error(
      'Anda mengakses context di luar jangkauan provider, context hanya dapat diakses di dalam Provider component!'
    );
  return context;
}

export { CitiesProvider, useCities };
