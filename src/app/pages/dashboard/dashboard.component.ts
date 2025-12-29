import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  bookings: any[] = [];
  user: any;

  constructor(
    private auth: AuthService, 
    private bookingService: BookingService 
  ) {}

  ngOnInit() {
    this.user = this.auth.currentUser();
    this.loadRealTimeBookings();
  }

  loadRealTimeBookings() {
    if (this.user?.email) {
      this.bookingService.getBookingHistory(this.user.email).subscribe({
        next: (data) => {
          this.bookings = data; 
        },
        error: (err) => console.error("Could not fetch history", err)
      });
    }
  }

  cancelBooking(pnr: string) {
    if (confirm("Cancel this flight?")) {
      this.bookingService.cancelTicket(pnr).subscribe({
        next: (res) => {
          alert(res); 
          this.loadRealTimeBookings(); 
        }
      });
    }
  }
}