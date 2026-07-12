import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import { PermissionsProvider } from "./context/PermissionsContext";
import AppRoutes from "./routes/AppRoutes";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PermissionsProvider>
          <AppRoutes />
          <ToastContainer position="top-right" autoClose={3000} />
        </PermissionsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
