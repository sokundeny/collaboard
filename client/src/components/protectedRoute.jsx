import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user ,loadingToken} = useAuth();
    if (loadingToken) {
    return <p>Loading...</p>; // or a spinner
  }
  return (user) ? children : <Navigate to="/login" />;
}
