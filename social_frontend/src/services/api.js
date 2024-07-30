import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true, // Ensure cookies are sent with requests
});

// Request interceptor to add the session ID and CSRF token to the headers
api.interceptors.request.use(
  (config) => {
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];

    // const sessionId = localStorage.getItem('sessionid');
    const sessionId = 'ymmf0yv8q6vgllo4iobjln6o9vihca18';

    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }

    if (sessionId) {
      config.headers['Authorization'] = `Session ${sessionId}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
