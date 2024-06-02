import {  useNavigate } from 'react-router-dom';
import styles from './Map.module.css';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from 'react-leaflet';
import { useState, useEffect } from 'react';
import { useCities } from '../contexts/CitiesContext';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from './Button';
import useUrlPosition from '../hooks/useUrlPosition';

function Map() {
  const [mapPosition, setMapPosition] = useState([
    38.727881642324164, -9.140900099907554,
  ]);
  const { cities } = useCities();
  const [mapLat, mapLng] = useUrlPosition();
  const { position: geoLocPosition, getPosition } = useGeolocation();

  useEffect(
    function () {
      if (!mapLat || !mapLng) return;

      setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geoLocPosition) setMapPosition([geoLocPosition.lat, geoLocPosition.lng]);
    },
    [geoLocPosition]
  );

  return (
    <MapContainer
      center={mapPosition}
      zoom={7}
      scrollWheelZoom={true}
      className={styles.mapContainer}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />

      {cities.map((city) => (
        <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
          <Popup>
            <span>{city.emoji}</span> <span>{city.cityName}</span>
          </Popup>
        </Marker>
      ))}

      <ChangeCenter position={mapPosition} />
      <DetectClick />
      
      {!geoLocPosition && <Button type="position" onClick={getPosition}>Use Your Position</Button>}
    </MapContainer>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);

  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvent({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
