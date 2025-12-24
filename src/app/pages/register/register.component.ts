import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  regData = { username: '', email: '', password: '' };

  constructor(private auth: AuthService, private router: Router) {}

  onRegister() {
    this.auth.register(this.regData).subscribe({
      next: () => {
        alert('Registration Successful! Please login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration Error', err);
        alert(err.error?.message || 'Registration failed');
      }
    });
  }

}