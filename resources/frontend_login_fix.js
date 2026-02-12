// Frontend Login Fix
// Ensure this script runs after login form submission

async function handleLogin(token) {
    localStorage.setItem('token', token);

    try {
        const response = await fetch('http://127.0.0.1:8000/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }

        const user = await response.json();

        // Redirect based on role
        if (user.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else if (user.role === 'teacher') {
            window.location.href = 'teacher-dashboard.html';
        } else {
            // Default to student
            window.location.href = 'student-dashboard.html';
        }
    } catch (error) {
        console.error('Login redirection error:', error);
        alert('Login successful, but redirection failed.');
    }
}
