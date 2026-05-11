import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("agrighar_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser  = (data) => API.post("/auth/register", data);
export const loginUser     = (data) => API.post("/auth/login", data);
export const getProfile    = ()     => API.get("/auth/profile");
export const updateProfile = (data) => API.put("/auth/profile", data);

// Products
export const getProducts       = (params) => API.get("/products", { params });
export const getProductById    = (id)      => API.get(`/products/${id}`);
export const createProduct     = (data)    => API.post("/products", data);
export const updateProduct     = (id, data)=> API.put(`/products/${id}`, data);
export const deleteProduct     = (id)      => API.delete(`/products/${id}`);
export const getFarmerProducts = ()        => API.get("/products/my-listings");

// Orders
export const placeOrder      = (data) => API.post("/orders", data);
export const getMyOrders     = ()     => API.get("/orders/my-orders");
export const getOrderById    = (id)   => API.get(`/orders/${id}`);
export const getFarmerOrders = ()     => API.get("/orders/farmer-orders");
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });

// Reviews
export const getReviews   = (productId) => API.get(`/reviews/${productId}`);
export const submitReview = (data)      => API.post("/reviews", data);

// Farmers
export const getNearbyFarmers = (lat, lng) => API.get("/farmers/nearby", { params: { lat, lng } });
export const getAllFarmers     = ()         => API.get("/farmers");

export default API;
