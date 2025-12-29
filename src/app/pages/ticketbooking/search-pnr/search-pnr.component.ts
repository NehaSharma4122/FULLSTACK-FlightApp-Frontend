import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-search-pnr',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-pnr.component.html',
  styleUrl: './search-pnr.component.css'
})
export class SearchPnrComponent {
  pnr: string = '';
  ticket: any = null;

  constructor(private bookingService: BookingService) {}

  onSearch() {
    this.bookingService.getTicket(this.pnr).subscribe({
      next: (res) => this.ticket = res,
      error: (err) => alert("Ticket not found with PNR:"+this.pnr)
    });
  }
}