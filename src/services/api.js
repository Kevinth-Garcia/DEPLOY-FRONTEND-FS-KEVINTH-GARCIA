const API_BASE_URL = "https://deploy-backend-fs.vercel.app/api";

// Función para obtener el token de autenticación
const getAuthToken = () => {
    if (typeof window !== "undefined") {
        return sessionStorage.getItem("authToken");
    }
    return null;
};

// Función para construir headers con autenticación
const getHeaders = (includeAuth = true) => {
    const headers = {
        "Content-Type": "application/json",
    };

    if (includeAuth) {
        const token = getAuthToken();
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    return headers;
};

const handleResponse = async (response) => {
    let data;
    try {
        data = await response.json();
    } catch (error) {
        console.error("Error parsing response:", error);
        throw new Error("Error al procesar la respuesta del servidor");
    }

    if (!response.ok) {
        // Si el token expiró, limpiar la sesión
        if (response.status === 401) {
            if (typeof window !== "undefined") {
                sessionStorage.removeItem("authToken");
                sessionStorage.removeItem("authUser");
                window.location.href = "/login";
            }
        }

        // Mostrar errores de validación si existen
        const errorMessage =
            data.message ||
            (data.errors && data.errors.length > 0
                ? data.errors.map((e) => e.msg || e.message).join(", ")
                : null) ||
            `HTTP error, status: ${response.status}`;

        throw new Error(errorMessage);
    }
    return data;
};

// API de Autenticación
export const authAPI = {
    register: async (userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: getHeaders(false),
                body: JSON.stringify(userData),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error en registro:", error);
            throw error;
        }
    },

    login: async (credentials) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: getHeaders(false),
                body: JSON.stringify(credentials),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error en login:", error);
            throw error;
        }
    },

    getMe: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: getHeaders(true),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error obteniendo usuario:", error);
            throw error;
        }
    },
};

// API de Productos
export const productsAPI = {
    getAll: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/products`, {
                headers: getHeaders(false),
            });
            const data = await handleResponse(response);
            return data.data || data; // Ajustar según la estructura de respuesta
        } catch (error) {
            console.error("Error en fetching de productos:", error);
            throw error;
        }
    },
    getById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                headers: getHeaders(false),
            });
            const data = await handleResponse(response);
            return data.data || data;
        } catch (error) {
            console.error("Error en fetching de producto ", id, error);
            throw error;
        }
    },
    create: async (product) => {
        try {
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: "POST",
                headers: getHeaders(true),
                body: JSON.stringify(product),
            });
            const data = await handleResponse(response);
            return data.data || data;
        } catch (error) {
            console.error("Error creando producto:", error);
            throw error;
        }
    },
};

// API de Órdenes
export const ordersAPI = {
    create: async (order) => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: "POST",
                headers: getHeaders(true),
                body: JSON.stringify(order),
            });
            const data = await handleResponse(response);
            return data.data || data;
        } catch (error) {
            console.error("Error creando orden:", error);
            throw error;
        }
    },
    getAll: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                headers: getHeaders(true),
            });
            const data = await handleResponse(response);
            return data.data || data;
        } catch (error) {
            console.error("Error obteniendo órdenes:", error);
            throw error;
        }
    },
};

export const checkServerHealth = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch (error) {
        console.error("La verificacion de servidor ha fallado", error);
        return false;
    }
};
