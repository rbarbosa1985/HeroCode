import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "./contexts/AuthContext";
import "./global.css";
import { RouteApp } from "./routes";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <AuthProvider>
        <RouteApp />
      </AuthProvider >
    </BrowserRouter>
  )
}

export default App
