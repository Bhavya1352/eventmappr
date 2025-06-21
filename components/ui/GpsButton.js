import { useMap } from 'react-leaflet';

function GpsButton() {
    
  const map = useMap();

  const centerMapToUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 13);
      },()=>{
        alert('Unable to retrieve your location.');
      });
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className='gps-button-div'>
      <button className='gps-button' onClick={centerMapToUser}>
        <img src='/images/gps.png' className='gps-icon' alt='GPS' />
      </button>
    </div>
  );
}

export default GpsButton;
