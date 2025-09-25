using System.ComponentModel.DataAnnotations;

namespace Login_Authentication.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        public bool EmailConfirmed { get; set; } = false;
        
        public string? OtpCode { get; set; }
        
        public DateTime? OtpExpiry { get; set; }
        
        public UserRole Role { get; set; } = UserRole.Employee;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
    
    public enum UserRole
    {
        Employee = 1,
        Admin = 2
    }
}