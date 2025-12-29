import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../services/booking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cancel-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cancel-booking.component.html',
  styleUrl: './cancel-booking.component.css'
})
export class CancelBookingComponent {
  pnr: string = '';

  constructor(private bookingService: BookingService, private router: Router) {}

  confirmCancel() {
    if(!this.pnr) return;
    
    if(confirm("Are you sure you want to cancel booking " + this.pnr + "?")) {
      this.bookingService.cancelTicket(this.pnr).subscribe({
        next: (res: any) => {
          alert("Response: " + res);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => alert(err.error || "Cancellation failed.")
      });
    }
  }
}