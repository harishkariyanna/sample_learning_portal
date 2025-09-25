using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using Login_Authentication.Data;
using Login_Authentication.Models;

namespace Login_Authentication.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterDto request);
        Task<AuthResponse> ConfirmOtpAsync(ConfirmOtpDto request);
        Task<AuthResponse> LoginAsync(LoginDto request);
        Task<AuthResponse> ForgotPasswordAsync(ForgotPasswordDto request);
        Task<AuthResponse> ResetPasswordAsync(ResetPasswordDto request);
    }

    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IJwtService _jwtService;
        private readonly IEmailService _emailService;

        public AuthService(ApplicationDbContext context, IJwtService jwtService, IEmailService emailService)
        {
            _context = context;
            _jwtService = jwtService;
            _emailService = emailService;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterDto request)
        {
            if (request.Password != request.ConfirmPassword)
                return new AuthResponse { Message = "Passwords do not match" };

            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return new AuthResponse { Message = "Email already exists" };

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                EmailConfirmed = true,
                Role = UserRole.Employee
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _jwtService.GenerateToken(user);
            await _emailService.SendWelcomeEmailAsync(user.Email, user.Name);

            return new AuthResponse 
            { 
                Token = token,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                Message = "Registration successful! Welcome to the portal." 
            };
        }

        public async Task<AuthResponse> ConfirmOtpAsync(ConfirmOtpDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            
            if (user == null)
                return new AuthResponse { Message = "User not found" };

            if (user.OtpCode != request.OtpCode || user.OtpExpiry < DateTime.UtcNow)
                return new AuthResponse { Message = "Invalid or expired OTP" };

            user.EmailConfirmed = true;
            user.OtpCode = null;
            user.OtpExpiry = null;
            
            await _context.SaveChangesAsync();

            return new AuthResponse 
            { 
                Email = user.Email, 
                Message = "Email confirmed successfully. You can now login." 
            };
        }

        public async Task<AuthResponse> LoginAsync(LoginDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return new AuthResponse { Message = "Invalid credentials" };

            var token = _jwtService.GenerateToken(user);
            
            // Send welcome email after successful login
            await _emailService.SendWelcomeEmailAsync(user.Email, user.Name);
            
            return new AuthResponse
            {
                Token = token,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                Message = "Login successful"
            };
        }

        public async Task<AuthResponse> ForgotPasswordAsync(ForgotPasswordDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            
            if (user == null)
                return new AuthResponse { Message = "Email not found" };

            var otpCode = GenerateOtp();
            user.OtpCode = otpCode;
            user.OtpExpiry = DateTime.UtcNow.AddMinutes(10);
            
            await _context.SaveChangesAsync();
            await _emailService.SendOtpEmailAsync(user.Email, otpCode);

            return new AuthResponse 
            { 
                Email = user.Email, 
                Message = "OTP sent to your email for password reset" 
            };
        }

        public async Task<AuthResponse> ResetPasswordAsync(ResetPasswordDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            
            if (user == null)
                return new AuthResponse { Message = "User not found" };

            if (user.OtpCode != request.OtpCode || user.OtpExpiry < DateTime.UtcNow)
                return new AuthResponse { Message = "Invalid or expired OTP" };

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.OtpCode = null;
            user.OtpExpiry = null;
            
            await _context.SaveChangesAsync();

            return new AuthResponse 
            { 
                Email = user.Email, 
                Message = "Password reset successfully" 
            };
        }

        private string GenerateOtp()
        {
            return new Random().Next(100000, 999999).ToString();
        }
    }
}