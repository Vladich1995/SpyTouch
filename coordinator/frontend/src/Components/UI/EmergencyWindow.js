import React,{useState, useEffect} from "react";
import styles from "./EmergencyWindow.module.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {Icon} from "leaflet";
import 'leaflet/dist/leaflet.css';
import { decode } from 'base64-arraybuffer';
import AudioPlayer from "./AudioPlayer";

const EmergencyWindow = (props) => {
    const longitude = props.location.coords.longitude;
    const latitude = props.location.coords.latitude;
    const position = [latitude, longitude];
    const customIcon = new Icon({
        iconUrl: require("../../images/pngegg.png"),
        iconSize: [38, 38]
    });
    

    const closeWindow = () => {
        props.closeWindow();
    }


    return(
        <div className={styles.container}>
            <div className={styles.title}>
                <button className={styles.close} onClick={closeWindow}>X</button>
            </div>
            <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: 400, width: 600 }}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} icon={customIcon}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
                </Marker>
            </MapContainer>
            <div className={styles.buttonContainer}>
                <AudioPlayer audioUrl={props.url} />
            </div>
        </div>
      );
}

export default EmergencyWindow;