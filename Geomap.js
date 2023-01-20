import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import LayerProps  from "react-map-gl";


import Map, {
    Source,
    Layer,
    NavigationControl,
    FullscreenControl,
    ScaleControl,
    GeolocateControl,
} from "react-map-gl";
import Geocontrol from "./Geocontrol";
const MAPBOX_TOKEN = "pk.eyJ1IjoidGVtcHJhbm92YSIsImEiOiJjaWd0c3M2MW4wOHI2dWNrbzZ5dWo1azVjIn0.x5sm8OjRxO9zO_uUmxYEqg";
const pointLayer: LayerProps = {
    id: "point",
    type: "circle",
    paint: {
        "circle-radius": 10,
        "circle-color": "#007cbf",
    },
};
function pointOnCircle({ center, angle, radius }) {
    const data = {
        type: "Point",
        coordinates: [
            center[0] + Math.cos(angle) * radius,
            center[1] + Math.sin(angle) * radius,
        ],
    };
    console.log(data);
    return data;
}
export default function Geomap() {

    const [pointData, setPointData] = useState(null);
    const [lat, setLat] = useState(25.77797080193535);
    const [long, setLong] = useState(86.06783654890093);
    const mapRef = useRef(null);
    const onSelectCity = (data) => {
        console.log("lattitute", data.geo_lat);
        console.log("longitute", data.geo_long);
        if (data.geo_long !== "" && data.geo_lat !== "") {

            setLat(data.geo_lat);
            setLong(data.geo_long);
            mapRef.current.getMap().flyTo({
                center: [data.geo_long, data.geo_lat],
                duration: 2000,
            });
            const animation = window.requestAnimationFrame(() =>
                setPointData(
                    pointOnCircle({
                        center: [long, lat],
                        angle: Date.now() / 1000,
                        radius: 0.8,
                    })
                )
            );
            return () => window.cancelAnimationFrame(animation);
        }
    };
    //   useEffect(() => {

    //     let animation;

    //     const updatePointData = () => {

    //         setPointData(

    //             pointOnCircle({

    //                 center: [long, lat],

    //                 angle: Date.now() / 1000,

    //                 radius: 0.8,

    //             })

    //         );

    //         animation = window.requestAnimationFrame(updatePointData);

    //     }

    //     updatePointData();

    //     return () => window.cancelAnimationFrame(animation);

    // }, [long, lat]);
    const animationRef = useRef(null);
    const pointDataRef = useRef(null);
    useEffect(() => {
        const updatePointData = () => {
            pointDataRef.current = pointOnCircle({
                center: [long, lat],
                angle: Date.now() / 1000,
                radius: 0.8,
            });
            animationRef.current = window.requestAnimationFrame(updatePointData);
        }
        updatePointData();
        return () => window.cancelAnimationFrame(animationRef.current);
    }, [long, lat]);
    return (
        <>
            <Map
                ref={mapRef}
                initialViewState={{
                    latitude: 25.77797080193535,
                    longitude: 86.06783654890093,
                    zoom: 3,
                }}
                mapStyle="mapbox://styles/mapbox/light-v9"
                mapboxAccessToken={MAPBOX_TOKEN}
            >
                <GeolocateControl position="top-left" />
                <FullscreenControl position="top-left" />
                <NavigationControl position="top-left" />
                <ScaleControl />
                <Geocontrol onSelectCity={onSelectCity} />
                {pointDataRef.current && (
                    <Source type="geojson" data={pointData}>
                        <Layer {...pointLayer} />
                    </Source>
                )}
            </Map>
        </>
    );
}
export function renderToDom(container) {
    render(<Geomap />, container);
}