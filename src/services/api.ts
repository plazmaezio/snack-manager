const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  throw new Error(
    "VITE_API_BASE_URL is not defined in the environment variables",
  );
}

const getAuthHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
});

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }
  return response.json();
};

export const api = {
  get: <T>(endpoint: string): Promise<T> =>
    fetch(`${BASE_URL}${endpoint}`, { headers: getAuthHeader() }).then(
      handleResponse,
    ),

  post: <T>(endpoint: string, body: unknown): Promise<T> =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  put: <T>(endpoint: string, body: unknown): Promise<T> =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getAuthHeader(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  delete: <T>(endpoint: string): Promise<T> =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    }).then(handleResponse),
};
