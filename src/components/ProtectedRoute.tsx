import { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://ws-be-111659801199.asia-south2.run.app/api/v1/authentication/verify",
      {
        credentials: "include",
      }
    )
      .then((res) => {
        setIsAuthenticated(res.ok);
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-400 to-blue-800 text-white">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </div>
    );

  return isAuthenticated ? children : <Navigate to={"/login"} />;
};

export default ProtectedRoute;
