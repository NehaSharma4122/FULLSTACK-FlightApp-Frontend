import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  passwords = { oldPassword: '', newPassword: '' };
  confirmPassword = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (this.passwords.newPassword !== this.confirmPassword) {
      this.error = "Passwords do not match!";
      return;
    }

    this.auth.changePassword(this.passwords).subscribe({
      next: (res) => {
        alert("Password updated successfully! Please login again.");
        this.auth.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err.error?.message || "Password change failed. Check policy requirements.";
      }
    });
  }
}