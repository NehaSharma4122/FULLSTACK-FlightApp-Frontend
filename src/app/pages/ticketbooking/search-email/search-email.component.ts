import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../services/booking.service';
import { AuthService } from '../../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-email',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './search-email.component.html',
  styleUrl: './search-email.component.css'
})
export class SearchEmailComponent {
  email: string = '';
  history = signal<any[]>([]); 
  loading = signal<boolean>(false);

  constructor(
    private bookingService: BookingService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const userData = this.auth.currentUser();
    if (userData && userData.email) {
      this.email = userData.email;
      this.fetchHistory(); 
    } else {
      alert("Please login to view your bookings.");
    }
  }

  fetchHistory() {
    this.loading.set(true);
    this.bookingService.getBookingHistory(this.email).subscribe({
      next: (res) => {
        this.history.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        console.error("Backend Error:", err);
        alert("Failed to fetch history. Ensure Gateway (8091) is running.");
      }
    });
  }
}