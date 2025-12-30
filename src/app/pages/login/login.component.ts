import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // 1. MUST HAVE THIS
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,RouterLink], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData = {
    email: '',
    password: '',
    role: 'ROLE_USER'
  };
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  handleLogin() {
    console.log("Login button clicked!", this.loginData);
    this.errorMessage = '';
    this.auth.login(this.loginData).subscribe({
      next: (res: any) => {

        const user = {
          name: res.username,
          email: res.email,
          role: res.role,
          token: res.token
        };

        localStorage.setItem('user', JSON.stringify(user));   // ✅ STORE USER
        localStorage.setItem('token', res.token);
        localStorage.setItem('name',res.username);

        if (user.role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },


      error: (err) => {
        if (err.status === 426) {
          alert("Your password has expired. Redirecting to change password.");
          localStorage.setItem('resetEmail', this.loginData.email);
          this.router.navigate(['/reset-password']);
        } 
        else if (err.status === 423) {
          this.errorMessage = "Account locked due to failed attempts. Please try again in 15 mins.";
        } 
        else if (err.status === 401) {
          this.errorMessage = "Invalid email or password.";
        }
        else{
          this.errorMessage = "Server unreachable. Please ensure Gateway (8091) is running.";
        }
      }
    });
  }
}