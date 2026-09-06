import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App.jsx'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice.js'

function useGetCurrentUser() {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get(`${serverUrl}/api/users/current`, { withCredentials: true });
                console.log('Current user data:', response);
                dispatch(setUserData(response.data));
            } catch (error) {
                // Ignore 401 Unauthorized errors as they simply mean the user is not logged in yet
                if (error.response?.status !== 401) {
                    console.error('Error fetching current user:', error);
                }
            }
        }

        fetchCurrentUser();
    }, [dispatch])
}

export default useGetCurrentUser
