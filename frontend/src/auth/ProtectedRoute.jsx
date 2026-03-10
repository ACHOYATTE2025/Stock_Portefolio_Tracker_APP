import { Navigate } from "react-router-dom";
import { getAccessToken } from "../utils/tokenStorage";

function ProtectedRoute({ children }) {

  const token = getAccessToken();

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;