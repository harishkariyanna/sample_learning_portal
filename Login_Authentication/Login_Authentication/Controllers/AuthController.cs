using Microsoft.AspNetCore.Mvc;
using Login_Authentication.Models;
using Login_Authentication.Services;

namespace Login_Authentication.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.RegisterAsync(request);
            
            if (string.IsNullOrEmpty(result.Token))
                return BadRequest(new { message = result.Message });

            return Ok(result);
        }

        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmOtp([FromBody] ConfirmOtpDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.ConfirmOtpAsync(request);
            
            if (result.Message.Contains("Invalid") || result.Message.Contains("expired"))
                return BadRequest(new { message = result.Message });

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.LoginAsync(request);
            
            if (string.IsNullOrEmpty(result.Token))
                return Unauthorized(new { message = result.Message });

            return Ok(result);
        }

        [HttpPost("forgot")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.ForgotPasswordAsync(request);
            
            if (result.Message.Contains("not found"))
                return BadRequest(new { message = result.Message });

            return Ok(result);
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.ResetPasswordAsync(request);
            
            if (result.Message.Contains("Invalid") || result.Message.Contains("expired"))
                return BadRequest(new { message = result.Message });

            return Ok(result);
        }
    }
}