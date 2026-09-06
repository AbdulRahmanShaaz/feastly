import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCity } from '../redux/userSlice';
import axios from 'axios';

function UseGetCity() {
    const dispatch = useDispatch();

    const apiKey = import.meta.env.VITE_GEO_APIFY;

    const { userData, city } = useSelector((state) => state.user);

    // Prevent multiple location attempts
    const hasAttempted = useRef(false);

    useEffect(() => {

        // Don't run if:
        // 1. User is not logged in
        // 2. City is already available
        // 3. We already attempted to get the location
        if (!userData || city || hasAttempted.current) return;

        console.log("USEGETCITY RAN");

        hasAttempted.current = true;

        navigator.geolocation.getCurrentPosition(

            // SUCCESS
            async (position) => {
                try {

                    console.log("POSITION:", position);

                    const { longitude, latitude } = position.coords;

                    console.log("LAT:", latitude);
                    console.log("LONG:", longitude);

                    const result = await axios.get(
                        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`,
                        {
                            timeout: 5000
                        }
                    );

                    console.log("GEOAPIFY RESPONSE:", result.data);

                    const properties = result.data?.features?.[0]?.properties;

                    if (properties) {

                        const locationName =
                            properties.city ||
                            properties.town ||
                            properties.county ||
                            properties.name ||
                            "Unknown";

                        console.log("CITY FOUND:", locationName);

                        dispatch(setCity(locationName));
                    }

                } catch (error) {

                    console.log(
                        "Geoapify API Error:",
                        error.message
                    );
                }
            },

            // ERROR
            (error) => {
                console.log(
                    "LOCATION ERROR:",
                    error.code,
                    error.message
                );
            },

            // OPTIONS
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );

    }, [userData, city, dispatch, apiKey]);

    return null;
}

export default UseGetCity;