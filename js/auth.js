import { API_BASE_URL, setAccessToken } from './api.js';

function showAlert(message, isError = true) {
    const alertBox = document.getElementById('alertBox');
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.className = `alert ${isError ? 'alert-error' : 'alert-success'}`;
    alertBox.style.display = 'block';
}

function handleSignup(event) {
    event.preventDefault();
    const form = event.target;
    const fullName = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const gender = form.gender.value;

    fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, gender })
    })
    .then(async res => {
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || data.error || 'Signup failed');
        }
        showAlert('Account created successfully! Redirecting...', false);
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    })
    .catch(err => {
        showAlert(err.message);
    });
}

function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(async res => {
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || data.error || 'Login failed');
        }
        if (data.accessToken) {
            setAccessToken(data.accessToken);
            window.location.href = 'dashboard.html';
        } else {
            throw new Error('Token missing from response');
        }
    })
    .catch(err => {
        showAlert(err.message);
    });
}

const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}
