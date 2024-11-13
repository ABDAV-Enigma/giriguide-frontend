import "./App.css";
import Login from "./pages/auth/Login";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  if (isLoggedIn) {
    navigate("/dashboard");
  }
  return <Login />;
}

export default App;
