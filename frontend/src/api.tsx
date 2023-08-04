import axios from "axios";

const baseURL = "http://localhost:5000"; // Replace with your backend URL

// Function to handle API errors
function handleAPIError(error: any) {
  if (error.response) {
    // The request was made, but the server responded with an error status
    console.error("API Error:", error.response.data);
    return Promise.reject(error.response.data);
  } else if (error.request) {
    // The request was made, but no response was received
    console.error("No response from server:", error.request);
    return Promise.reject({ error: "No response from server" });
  } else {
    // Something happened in setting up the request that triggered an error
    console.error("Error in request setup:", error.message);
    return Promise.reject({ error: "Request error" });
  }
}

// Function to set the JWT token in Axios headers
export function setAuthToken(token: string | null) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}

// Function to register a new user
export function registerUser(username: string, password: string) {
  return axios
    .post(`${baseURL}/register`, { username, password })
    .then((response) => response.data)
    .catch(handleAPIError);
}

// Function to log in the user and get the access token
export function loginUser(username: string, password: string) {
  return axios
    .post(`${baseURL}/login`, { username, password })
    .then((response) => response.data.access_token)
    .catch(handleAPIError);
}

// Function to log out the user
export function logoutUser(token: string) {
  setAuthToken(token); // Include the token in the headers
  return axios
    .get(`${baseURL}/logout`)
    .then((response) => response.data)
    .catch(handleAPIError);
}

// Function to shorten a URL
export function shortenURL(longURL: string, token: string) {
  setAuthToken(token);
  return axios
    .post(`${baseURL}/shorten`, { long_url: longURL })
    .then((response) => response.data)
    .catch(handleAPIError);
}

// Function to get user URLs
export function getUserURLs(token: string) {
  setAuthToken(token);
  return axios
    .get(`${baseURL}/urls`)
    .then((response) => response.data.urls)
    .catch(handleAPIError);
}

export function editURL(shortCode: string, newLongURL: string, token: string) {
  setAuthToken(token);
  return axios
    .put(`${baseURL}/urls/${shortCode}`, { long_url: newLongURL })
    .then((response) => response.data)
    .catch(handleAPIError);
}

export function deleteURL(shortCode: string, token: string) {
  setAuthToken(token);
  return axios
    .delete(`${baseURL}/urls/${shortCode}`)
    .then((response) => response.data)
    .catch(handleAPIError);
}
