import "./App.css";
import Game from "./pages/Game";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Arena from "./pages/Arena";
import Howtoplay from "./pages/Howtoplay";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/game"
        element={
          <ProtectedRoute>
            <Game />
          </ProtectedRoute>
        }
      />
      <Route
        path="/arena"
        element={
          <ProtectedRoute>
            <Arena />
          </ProtectedRoute>
        }
      />
      <Route
        path="/howtoplay"
        element={
          <ProtectedRoute>
            <Howtoplay />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
