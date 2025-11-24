import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        // Redirigir al login si no está autenticado
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;

