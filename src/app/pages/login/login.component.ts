import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // 1. MUST HAVE THIS
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,RouterLink], // 2. MUST HAVE THIS
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData = { email: '', password: '' };

  constructor(private auth: AuthService, private router: Router) {}

  handleLogin() {
    console.log("Login button clicked!", this.loginData);
    
    this.auth.login(this.loginData).subscribe({
      next: (res) => {
        console.log("Login Success", res);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error("Login Error", err);
        alert("Invalid credentials" + (err.error?.message || "Check your email and password"));
      }
    });
  }
}