import { fetchWithAuth, getAccessToken, clearAccessToken } from './api.js';

// Auth Guard
if (!getAccessToken()) {
    window.location.href = 'login.html';
}

const profileForm = document.getElementById('profileForm');
const alertBox = document.getElementById('alertBox');
const logoutBtn = document.getElementById('logoutBtn');
const profileImagePreview = document.getElementById('profileImagePreview');
const imageInput = document.getElementById('image');

function showAlert(message, isError = true) {
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.className = `alert ${isError ? 'alert-error' : 'alert-success'}`;
    alertBox.style.display = 'block';
    setTimeout(() => { alertBox.style.display = 'none'; }, 5000);
}

// Fetch and populate profile
async function loadProfile() {
    try {
        const res = await fetchWithAuth('/api/profile');
        if (res.status === 401) {
            clearAccessToken();
            window.location.href = 'login.html';
            return;
        }
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || data.error || 'Failed to fetch profile');
        
        const user = data.user || data;
        
        document.getElementById('fullName').value = user.fullName || user.name || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('gender').value = user.gender || '';
        document.getElementById('address').value = user.address || '';
        document.getElementById('city').value = user.city || '';
        document.getElementById('universityName').value = user.universityName || '';
        document.getElementById('guardianName').value = user.guardianName || '';
        document.getElementById('guardianPhoneNumber').value = user.guardianPhoneNumber || '';
        document.getElementById('personalMobileNumber').value = user.personalMobileNumber || '';
        
        if (user.profileUrl) {
            profileImagePreview.src = user.profileUrl;
        }
    } catch (err) {
        showAlert(err.message);
    }
}

// Handle image preview
if (imageInput) {
    imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            // Quick local preview before upload
            profileImagePreview.src = URL.createObjectURL(file);
        }
    });
}

// Update Profile
if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Use FormData explicitly (multipart/form-data)
        const formData = new FormData(profileForm);
        
        // The email field is disabled, so it's not included in FormData. 
        // If the image input is empty, we can choose to delete it so we don't send an empty file,
        // though the server should gracefully handle an empty file field.
        const file = formData.get('image');
        if (file && file.size === 0) {
            formData.delete('image');
        }

        try {
            const res = await fetchWithAuth('/api/profile', {
                method: 'PATCH',
                body: formData
                // Note: Content-Type is NOT set here. fetchWithAuth is configured to 
                // omit Content-Type if body is FormData, allowing the browser to set boundary.
            });
            
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || data.error || 'Failed to update profile');
            
            showAlert('Profile updated successfully!', false);
            
            // If the server returns an updated user with a new profileUrl, update it.
            const updatedUser = data.user || data;
            if (updatedUser && updatedUser.profileUrl) {
                profileImagePreview.src = updatedUser.profileUrl;
            }
        } catch (err) {
            showAlert(err.message);
        }
    });
}

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        clearAccessToken();
        window.location.href = 'login.html';
    });
}

// Init
loadProfile();
