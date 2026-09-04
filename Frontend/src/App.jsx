import { Routes, Route } from "react-router-dom"
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import {useSelector} from "react-redux"
import { Navigate } from 'react-router-dom'
export const serverUrl = `http://localhost:8000`
import Home from './pages/Home.jsx'
function App() {
  useGetCurrentUser();
  const { userData } = useSelector((state) => state.user);

  return (
    <Routes>
      <Route path="/signup" element={!userData ? <SignUp/> : <Navigate to={"/"} />} />
      <Route path="/signin" element={userData ? <Navigate to={"/"} /> : <SignIn/>} />
      <Route path="/forgot-password" element={!userData ? <ForgotPassword/> : <Navigate to={"/"} />} />
      <Route path="/" element={userData ? <Home /> : <Navigate to="/signin" />} />
    </Routes>
  )
}

export default App
