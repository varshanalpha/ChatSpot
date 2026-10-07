// Frontend API client with fallback to pre-loaded realistic data if backend is starting up

const API_BASE = "/api";

export const getAuthToken = () => localStorage.getItem("chatspot_token");
export const setAuthToken = (token) => localStorage.setItem("chatspot_token", token);
export const removeAuthToken = () => localStorage.removeItem("chatspot_token");

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(err.detail || "Something went wrong");
    }

    return await res.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Auth
  login: (email, password) => request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (userData) => request("/auth/register", { method: "POST", body: JSON.stringify(userData) }),
  getMe: () => request("/auth/me"),
  demoLogin: (role) => request(`/auth/demo-login/${role}`, { method: "POST" }),

  // Menu
  getCategories: () => request("/menu/categories"),
  getMenu: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/menu${query ? `?${query}` : ""}`);
  },

  // Orders
  createOrder: (orderData) => request("/orders", { method: "POST", body: JSON.stringify(orderData) }),
  getMyOrders: () => request("/orders/my-orders"),
  getOrder: (id) => request(`/orders/${id}`),
  trackOrder: (tokenOrId) => request(`/orders/track/${tokenOrId}`),

  // Payments
  createPayment: (orderId, paymentMethod) => 
    request("/payments/create", { method: "POST", body: JSON.stringify({ order_id: orderId, payment_method: paymentMethod }) }),
  verifyPayment: (payload) => 
    request("/payments/verify", { method: "POST", body: JSON.stringify(payload) }),

  // Notifications
  getNotifications: () => request("/notifications"),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllNotificationsRead: () => request("/notifications/read-all", { method: "POST" }),

  // Canteen Status
  getCanteenStatus: () => request("/canteen/status"),

  // Staff & Admin
  getStaffOrders: (statusFilter) => 
    request(`/staff/orders${statusFilter ? `?status_filter=${statusFilter}` : ""}`),
  updateOrderStatus: (orderId, status) => 
    request(`/staff/orders/${orderId}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  addMenuItem: (itemData) => request("/staff/menu", { method: "POST", body: JSON.stringify(itemData) }),
  updateMenuItem: (id, itemData) => request(`/staff/menu/${id}`, { method: "PATCH", body: JSON.stringify(itemData) }),
  deleteMenuItem: (id) => request(`/staff/menu/${id}`, { method: "DELETE" }),
  getAnalytics: () => request("/admin/analytics"),
};
