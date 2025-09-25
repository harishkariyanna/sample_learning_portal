import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  forgotPasswordForm: FormGroup;
  message = '';
  isSuccess = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe({
        next: (response) => {
          this.isSuccess = true;
          this.message = response.message;
          setTimeout(() => {
            this.router.navigate(['/reset-password'], { 
              queryParams: { email: this.forgotPasswordForm.value.email } 
            });
          }, 2000);
        },
        error: (error) => {
          this.isSuccess = false;
          this.message = error.error?.message || 'Failed to send OTP';
        }
      });
    }
  }
}