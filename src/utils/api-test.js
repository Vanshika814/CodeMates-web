import { BASE_URL } from "./constants";

// Simple function to test if backend is reachable
export const testBackendConnection = async () => {
  try {
    console.log("🔍 Testing backend connection to:", BASE_URL);

    const response = await fetch(`${BASE_URL}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Backend health check successful:", data);
      return { success: true, data };
    } else {
      console.error(
        "❌ Backend health check failed:",
        response.status,
        response.statusText
      );
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error) {
    console.error("❌ Backend connection error:", error);
    return { success: false, error: error.message };
  }
};

// Test with Clerk authentication
export const testAuthenticatedEndpoint = async (getToken) => {
  try {
    const token = await getToken();
    console.log("🔍 Testing authenticated endpoint with token...");

    const response = await fetch(`${BASE_URL}/auth-status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Auth test successful:", data);
      return { success: true, data };
    } else {
      console.error(
        "❌ Auth test failed:",
        response.status,
        response.statusText
      );
      const errorData = await response.text();
      console.error("❌ Error details:", errorData);
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        details: errorData,
      };
    }
  } catch (error) {
    console.error("❌ Auth test error:", error);
    return { success: false, error: error.message };
  }
};
