import React,{useState, useEffect} from "react";
import styles from "./RealLocationWindow.module.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {Icon} from "leaflet";
import 'leaflet/dist/leaflet.css';
import LoadingSpinner from "./LoadingSpinner";

const RealLocationWindow = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const socket = props.socket;
    const [position, setPosition] = useState(null);
    const customIcon = new Icon({
        iconUrl: require("../../images/agentLocation.png"),
        iconSize: [38, 38]
    });

    const closeWindow = () => {
        props.closeWindow();
    }

    useEffect(() => {
        if (socket) {
          socket.on('gotLocation', (message)=>{
            setIsLoading(false);
            console.log("got");
            const latitude = message.location.coords.latitude;
            const longitude = message.location.coords.longitude;
            setPosition([latitude, longitude]);
          });
        }
      }, [socket]);

    useEffect(() => {
        let intervalId = setInterval(() => {
            getLocation();
        }, 5000);
    
        getLocation();
    
        return () => {
          clearInterval(intervalId);
        };
    }, []);


    const getLocation = async () => {
        try{
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/request/location`, {
                method: "POST",
                headers: {
                "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    agentId: props.agentInfo.id,
                    id: props.id
                })
            }).then((response) => {
                return response.json();
            }).then((data) => {
                console.log(data.success);
            });
          } catch (error) {
            alert("Error requesting a location: ", error);
          }
    }

    return(
        <div className={styles.container}>
            <div className={styles.title}>
                <button className={styles.close} onClick={closeWindow}>X</button>
            </div>
            {(position != null) ?(<MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: 400, width: 600 }}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} icon={customIcon}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
                </Marker>
            </MapContainer>):
            <LoadingSpinner />}
        </div>
      );
}

export default RealLocationWindow;