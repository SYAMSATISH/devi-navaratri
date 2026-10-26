export const API_URL =
  import.meta.env.VITE_API_URL || "https://devi-navaratri.onrender.com";

export function signOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
}

// Turns any backend error shape into one readable string.
function errorMessage(data, text, status) {
  if (data && typeof data === "object") {
    if (data.message) return data.message;
    const fieldErrors = Object.values(data).filter((v) => typeof v === "string");
    if (fieldErrors.length) return fieldErrors.join(", ");
  }
  return text || `Request failed (${status})`;
}

export async function apiFetch(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Expired / invalid token -> back to login
  if (response.status === 401 && token) {
    signOut();
    throw new Error("Session expired. Please log in again.");
  }

  const text = await response.text();
  let data = null;
  if (text.trim()) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    throw new Error(errorMessage(data, text, response.status));
  }

  return data;
}
