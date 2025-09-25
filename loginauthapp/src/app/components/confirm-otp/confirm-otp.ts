import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-otp',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './confirm-otp.html',
  styleUrl: './confirm-otp.css'
})
export class ConfirmOtp implements OnInit {
  confirmForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  email = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.confirmForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otpCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
        this.confirmForm.patchValue({ email: this.email });
      }
    });
  }

  onSubmit(): void {
    if (this.confirmForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      this.authService.confirmOtp(this.confirmForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = response.message;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'OTP confirmation failed';
        }
      });
    }
  }
}
