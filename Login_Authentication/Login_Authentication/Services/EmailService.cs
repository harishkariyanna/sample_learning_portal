using System.Net;
using System.Net.Mail;

namespace Login_Authentication.Services
{
    public interface IEmailService
    {
        Task SendOtpEmailAsync(string email, string otpCode);
        Task SendWelcomeEmailAsync(string email, string name);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendOtpEmailAsync(string email, string otpCode)
        {
            var smtpClient = new SmtpClient(_configuration["Email:SmtpServer"])
            {
                Port = int.Parse(_configuration["Email:SmtpPort"]!),
                Credentials = new NetworkCredential(_configuration["Email:FromEmail"], _configuration["Email:AppPassword"]),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_configuration["Email:FromEmail"]!),
                Subject = "Email Verification - OTP Code",
                Body = $@"
                    <h2>Email Verification</h2>
                    <p>Your OTP code is: <strong>{otpCode}</strong></p>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                ",
                IsBodyHtml = true,
            };

            mailMessage.To.Add(email);
            await smtpClient.SendMailAsync(mailMessage);
        }

        public async Task SendWelcomeEmailAsync(string email, string name)
        {
            var smtpClient = new SmtpClient(_configuration["Email:SmtpServer"])
            {
                Port = int.Parse(_configuration["Email:SmtpPort"]!),
                Credentials = new NetworkCredential(_configuration["Email:FromEmail"], _configuration["Email:AppPassword"]),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_configuration["Email:FromEmail"]!),
                Subject = "Welcome to Our Portal!",
                Body = $@"
                    <h2>Welcome to Our Portal, {name}!</h2>
                    <p>Thank you for joining us. Your account has been successfully created and verified.</p>
                    <p>You can now access all the features of our portal.</p>
                    <p>If you have any questions, feel free to contact our support team.</p>
                    <br>
                    <p>Best regards,<br>The Portal Team</p>
                ",
                IsBodyHtml = true,
            };

            mailMessage.To.Add(email);
            await smtpClient.SendMailAsync(mailMessage);
        }
    }
}