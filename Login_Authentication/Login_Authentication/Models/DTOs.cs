using System.ComponentModel.DataAnnotations;

namespace Login_Authentication.Models
{
    public class RegisterDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required, MinLength(6)]
        public string Password { get; set; } = string.Empty;
        
        [Required]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
    
    public class ConfirmOtpDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string OtpCode { get; set; } = string.Empty;
    }
    
    public class LoginDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string Password { get; set; } = string.Empty;
    }
    
    public class ForgotPasswordDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
    
    public class ResetPasswordDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string OtpCode { get; set; } = string.Empty;
        
        [Required, MinLength(6)]
        public string NewPassword { get; set; } = string.Empty;
    }
    
    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}