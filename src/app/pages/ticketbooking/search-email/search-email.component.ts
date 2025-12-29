import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-search-email',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-email.component.html',
  styleUrl: './search-email.component.css'
})
export class SearchEmailComponent {
  email: string = '';
  history: any[] = [];

  constructor(private bookingService: BookingService) {}

  fetchHistory() {
    this.bookingService.getBookingHistory(this.email).subscribe({
      next: (res) => this.history = res,
      error: (err) => alert("No history found for this email.")
    });
  }
}