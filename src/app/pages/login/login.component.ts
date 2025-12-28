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

  constructor(private auth: AuthService, private router: Router) {}

  handleLogin() {
    console.log("Login button clicked!", this.loginData);
    
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
        console.error("Login Error", err);
        alert(err.error?.message || "Invalid email or password");
      }
    });
  }
}