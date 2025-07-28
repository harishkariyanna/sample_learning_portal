// Database Configuration (Replace with your actual database endpoints)
const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your backend URL

// Utility Functions
function showAlert(message, type = 'danger') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const form = document.querySelector('form');
    form.insertBefore(alertDiv, form.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function setLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Password Toggle Functionality
function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('[id^="toggle"]');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.id.replace('toggle', '').toLowerCase();
            const passwordInput = document.getElementById(targetId) || 
                                document.getElementById('reg' + targetId) ||
                                document.getElementById('new' + targetId);
            
            if (passwordInput) {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                const icon = this.querySelector('i');
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    });
}

// OTP Input Functionality
function initOTPInputs() {
    const otpInputs = document.querySelectorAll('.otp-input');
    
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            if (this.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value === '' && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });
}

// Login Form Handler
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        setLoading(submitBtn, true);
        
        try {
            // Replace with actual API call
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userInfo', JSON.stringify(data.user));
                
                // Check if it's first login (temporary password)
                if (data.user.isFirstLogin) {
                    showAlert('Welcome! Please update your profile and change your password.', 'info');
                    // Redirect to profile update page
                    setTimeout(() => {
                        window.location.href = 'profile-update.html';
                    }, 2000);
                } else {
                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                }
            } else {
                showAlert(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            showAlert('Network error. Please try again later.');
        } finally {
            setLoading(submitBtn, false);
        }
    });
}

// Register Form Handler
function initRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;
    
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            showAlert('Passwords do not match.');
            return;
        }
        
        if (!validatePassword(password)) {
            showAlert('Password must be at least 8 characters with uppercase, lowercase, and number.');
            return;
        }
        
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('regEmail').value,
            phone: document.getElementById('phone').value,
            employeeId: document.getElementById('employeeId').value,
            department: document.getElementById('department').value,
            password: password
        };
        
        setLoading(submitBtn, true);
        
        try {
            // Replace with actual API call
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showAlert('Registration successful! Please login with your credentials.', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                showAlert(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showAlert('Network error. Please try again later.');
        } finally {
            setLoading(submitBtn, false);
        }
    });
}

// Forgot Password Functionality
function initForgotPassword() {
    const emailForm = document.getElementById('forgotEmailForm');
    const otpForm = document.getElementById('otpForm');
    const resetForm = document.getElementById('resetPasswordForm');
    
    let userEmail = '';
    
    // Step 1: Email submission
    if (emailForm) {
        emailForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            userEmail = document.getElementById('forgotEmail').value;
            
            setLoading(submitBtn, true);
            
            try {
                // Replace with actual API call
                const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: userEmail })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showStep('otpStep');
                    showAlert('OTP sent to your registered mobile number.', 'success');
                } else {
                    showAlert(data.message || 'Email not found.');
                }
            } catch (error) {
                console.error('Forgot password error:', error);
                showAlert('Network error. Please try again later.');
            } finally {
                setLoading(submitBtn, false);
            }
        });
    }
    
    // Step 2: OTP verification
    if (otpForm) {
        otpForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const otp = Array.from(document.querySelectorAll('.otp-input'))
                           .map(input => input.value)
                           .join('');
            
            if (otp.length !== 6) {
                showAlert('Please enter complete OTP.');
                return;
            }
            
            setLoading(submitBtn, true);
            
            try {
                // Replace with actual API call
                const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: userEmail, otp })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showStep('resetStep');
                    showAlert('OTP verified successfully.', 'success');
                } else {
                    showAlert(data.message || 'Invalid OTP.');
                }
            } catch (error) {
                console.error('OTP verification error:', error);
                showAlert('Network error. Please try again later.');
            } finally {
                setLoading(submitBtn, false);
            }
        });
    }
    
    // Step 3: Password reset
    if (resetForm) {
        resetForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmNewPassword').value;
            
            if (newPassword !== confirmPassword) {
                showAlert('Passwords do not match.');
                return;
            }
            
            if (!validatePassword(newPassword)) {
                showAlert('Password must be at least 8 characters with uppercase, lowercase, and number.');
                return;
            }
            
            setLoading(submitBtn, true);
            
            try {
                // Replace with actual API call
                const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: userEmail, newPassword })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showStep('successStep');
                } else {
                    showAlert(data.message || 'Password reset failed.');
                }
            } catch (error) {
                console.error('Password reset error:', error);
                showAlert('Network error. Please try again later.');
            } finally {
                setLoading(submitBtn, false);
            }
        });
    }
    
    // Navigation handlers
    const backToEmail = document.getElementById('backToEmail');
    const resendOtp = document.getElementById('resendOtp');
    
    if (backToEmail) {
        backToEmail.addEventListener('click', function(e) {
            e.preventDefault();
            showStep('emailStep');
        });
    }
    
    if (resendOtp) {
        resendOtp.addEventListener('click', async function(e) {
            e.preventDefault();
            
            try {
                // Replace with actual API call
                const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: userEmail })
                });
                
                if (response.ok) {
                    showAlert('OTP resent successfully.', 'success');
                    // Clear OTP inputs
                    document.querySelectorAll('.otp-input').forEach(input => input.value = '');
                    document.getElementById('otp1').focus();
                }
            } catch (error) {
                console.error('Resend OTP error:', error);
                showAlert('Failed to resend OTP.');
            }
        });
    }
}

// Helper Functions
function showStep(stepId) {
    document.querySelectorAll('.forgot-step').forEach(step => {
        step.classList.add('d-none');
    });
    document.getElementById(stepId).classList.remove('d-none');
}

function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initPasswordToggle();
    initOTPInputs();
    initLoginForm();
    initRegisterForm();
    initForgotPassword();
});

// Database Integration Examples (Replace with your actual backend)
/*
Example API Endpoints:

1. Login: POST /api/auth/login
   Body: { email, password }
   Response: { token, user: { id, name, email, isFirstLogin, role } }

2. Register: POST /api/auth/register
   Body: { firstName, lastName, email, phone, employeeId, department, password }
   Response: { message, user }

3. Forgot Password: POST /api/auth/forgot-password
   Body: { email }
   Response: { message }

4. Verify OTP: POST /api/auth/verify-otp
   Body: { email, otp }
   Response: { message, token }

5. Reset Password: POST /api/auth/reset-password
   Body: { email, newPassword }
   Response: { message }

6. Resend OTP: POST /api/auth/resend-otp
   Body: { email }
   Response: { message }

Database Schema Example:
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id VARCHAR(50) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    department VARCHAR(100),
    password_hash VARCHAR(255),
    is_first_login BOOLEAN DEFAULT TRUE,
    role ENUM('employee', 'manager', 'admin') DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE password_resets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255),
    otp VARCHAR(6),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/