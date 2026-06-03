# Quickstart: Vanilla Frontend

## Prerequisites
- Since this is a Vanilla HTML/CSS/JS frontend, no build step (like Webpack or Vite) is strictly required. 
- You need the backend API running locally (e.g., on `http://localhost:5000` or `5002`).
- A lightweight local server is recommended to serve the HTML files to avoid CORS or file:// protocol issues.

## Setup

1. **Start the local API backend**:
   ```bash
   yarn dev
   ```
   (Ensure it is running on the expected port, typically 5000/5002).

2. **Configure API URL**:
   Open `js/api.js` and verify that the `API_BASE_URL` matches your running backend port.
   ```javascript
   export const API_BASE_URL = 'http://localhost:5000'; 
   ```

3. **Serve the frontend**:
   Use a simple static file server from the root directory. For example, if you have `npx` installed:
   ```bash
   npx serve .
   ```
   Or using Python:
   ```bash
   python -m http.server 3000
   ```

4. **Access the application**:
   Open your browser and navigate to `http://localhost:3000/login.html`.
