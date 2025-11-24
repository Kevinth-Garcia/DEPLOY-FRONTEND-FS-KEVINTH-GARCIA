import { create } from "zustand";

// Store para manejar la autenticación del usuario
export const useAuthStore = create((set, get) => {
    // Inicializar desde sessionStorage si existe
    const initializeAuth = () => {
        if (typeof window !== "undefined") {
            const storedToken = sessionStorage.getItem("authToken");
            const storedUser = sessionStorage.getItem("authUser");

            if (storedToken && storedUser) {
                try {
                    return {
                        token: storedToken,
                        user: JSON.parse(storedUser),
                        isAuthenticated: true,
                    };
                } catch (error) {
                    console.error("Error al parsear usuario:", error);
                    sessionStorage.removeItem("authToken");
                    sessionStorage.removeItem("authUser");
                }
            }
        }
        return {
            token: null,
            user: null,
            isAuthenticated: false,
        };
    };

    const initialState = initializeAuth();

    return {
        token: initialState.token,
        user: initialState.user,
        isAuthenticated: initialState.isAuthenticated,

        // Función para establecer la autenticación
        setAuth: (token, user) => {
            if (typeof window !== "undefined") {
                sessionStorage.setItem("authToken", token);
                sessionStorage.setItem("authUser", JSON.stringify(user));
            }
            set({
                token,
                user,
                isAuthenticated: true,
            });
        },

        // Función para cerrar sesión
        logout: () => {
            if (typeof window !== "undefined") {
                sessionStorage.removeItem("authToken");
                sessionStorage.removeItem("authUser");
            }
            set({
                token: null,
                user: null,
                isAuthenticated: false,
            });
        },

        // Función para actualizar el usuario
        updateUser: (user) => {
            if (typeof window !== "undefined") {
                sessionStorage.setItem("authUser", JSON.stringify(user));
            }
            set({ user });
        },
    };
});

