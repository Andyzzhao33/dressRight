import React, { useState, useEffect } from "react";



function GetLocation () {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      if("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
  
          // todo: send location to the server to call weather api
        }, (error) => {
          setError(error.message);
        });
      }
      else {
        setError("Geolocation not available");
      }
    }, []);
  
    return (
      <div>
          <h2>Your Current Location</h2>
          {location && <p>Latitude: {location.latitude}, Longitude: {location.longitude}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }
  
export { GetLocation };