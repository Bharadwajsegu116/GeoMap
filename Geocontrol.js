import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
// import data from "./Data1";
function Geocontrol(props) {
  const [data5, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://192.168.0.119:8005/clusters/");
        // const response = await axios.get("https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson");
        console.log("response------------0000000-", response.data);
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div
      className="control-panel"
      style={{
        height: "300px",
        position: "absolute",
        top: "10px",
        right: "0",
        background: "white",
        overflowY: "scroll",
      }}
    >
      {data5
        .map((city, index) => (
          <div key={`btn-${index}`} className="input">
            <input
              type="radio"
              name="city"
              id={`city-${index}`}
              // defaultChecked={city.mr_id === "1111MRC195"}
              onClick={() => props.onSelectCity(city)}
            />
            <label htmlFor={`city-${index}`}>{city.mr_id}</label>
          </div>
        ))}
    </div>
  );
}
export default React.memo(Geocontrol);