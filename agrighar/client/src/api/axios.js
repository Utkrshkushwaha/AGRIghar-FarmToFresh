import axios from "axios";

// ✅ Always points to local backend (port 5000)
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// 🔐 Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("agrighar_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── AUTH ─────────────────────────────────────────────────────
export const registerUser  = (data) => API.post("/auth/register", data);
export const loginUser     = (data) => API.post("/auth/login", data);
export const getProfile    = ()     => API.get("/auth/profile");
export const updateProfile = (data) => API.put("/auth/profile", data);

// ── PRODUCTS ─────────────────────────────────────────────────
export const getProducts       = (params)    => API.get("/products", { params });
export const getProductById    = (id)        => API.get(`/products/${id}`);
export const createProduct     = (data)      => API.post("/products", data);
export const updateProduct     = (id, data)  => API.put(`/products/${id}`, data);
export const deleteProduct     = (id)        => API.delete(`/products/${id}`);
export const getFarmerProducts = ()          => API.get("/products/my-listings");

// ── ORDERS ───────────────────────────────────────────────────
export const placeOrder        = (data)      => API.post("/orders", data);
export const getMyOrders       = ()          => API.get("/orders/my-orders");
export const getOrderById      = (id)        => API.get(`/orders/${id}`);
export const getFarmerOrders   = ()          => API.get("/orders/farmer-orders");
export const updateOrderStatus = (id, status)=> API.put(`/orders/${id}/status`, { status });
export const cancelOrder       = (id)        => API.put(`/orders/${id}/cancel`);

// ── REVIEWS ──────────────────────────────────────────────────
export const getReviews   = (productId) => API.get(`/reviews/${productId}`);
export const submitReview = (data)      => API.post("/reviews", data);
export const deleteReview = (id)        => API.delete(`/reviews/${id}`);

// ── FARMERS ──────────────────────────────────────────────────
export const getAllFarmers     = ()          => API.get("/farmers");
export const getNearbyFarmers  = (lat, lng)  => API.get("/farmers/nearby", { params: { lat, lng } });
export const getFarmerById     = (id)        => API.get(`/farmers/${id}`);

export default API;
