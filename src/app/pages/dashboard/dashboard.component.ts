import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Important for *ngIf and *ngFor
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  bookings: any[] = [];

  constructor(private auth: AuthService) {}
  get user() {
    return this.auth.currentUser();
  }

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    const savedBookings = localStorage.getItem('myBookings');
    this.bookings = savedBookings ? JSON.parse(savedBookings) : [];
  }

  cancelBooking(id: any) {
    if(confirm("Are you sure you want to cancel this flight?")) {
      let current = JSON.parse(localStorage.getItem('myBookings') || '[]');
      current = current.filter((b: any) => b.id !== id);
      localStorage.setItem('myBookings', JSON.stringify(current));
      this.loadBookings(); // Refresh the list
    }
  }
}