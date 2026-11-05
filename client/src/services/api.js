// Centralized API service layer — ready for MongoDB/Express backend integration
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("ld_token");
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) throw new Error((await res.json()).message || "API Error");
  return res.json();
}

// Auth endpoints
export const authAPI = {
  login: (data) => request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data) => request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  verify: () => request("/auth/verify"),
};

// Donor endpoints
export const donorAPI = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/donors${q ? "?" + q : ""}`);
  },
  getById: (id) => request(`/donors/${id}`),
  update: (id, data) => request(`/donors/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  toggleAvailability: (id) => request(`/donors/${id}/toggle`, { method: "PATCH" }),
};

// Blood request endpoints
export const requestAPI = {
  create: (data) => request("/requests", { method: "POST", body: JSON.stringify(data) }),
  getAll: () => request("/requests"),
  getMine: () => request("/requests/mine"),
  getById: (id) => request(`/requests/${id}`),
  update: (id, data) => request(`/requests/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  respond: (id, response) => request(`/requests/${id}/respond`, { method: "POST", body: JSON.stringify({ response }) }),
};

// Notification endpoints
export const notifAPI = {
  getAll: () => request("/notifications"),
  markRead: (id) => request(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllRead: () => request("/notifications/read-all", { method: "PATCH" }),
};
