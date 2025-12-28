import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgFor
  ],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css']
})
export class BookingComponent {

  bookForm: any;
  pnr = '';
  email = '';
  ticket: any = null;
  history: any[] = [];

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService
  ) {
    this.bookForm = this.fb.group({
      flightId: [''],
      name: [''],
      email: [''],
      seats: [''],
      gender: ['']
    });
    const stored = localStorage.getItem('selectedFlight');

    if (stored) {
      const flight = JSON.parse(stored);

      // Auto-fill flightId in form
      this.bookForm.patchValue({
        flightId: flight.flightId
      });
    }
     // Auto-fill email of logged in user
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.email = user?.email || '';
  }

  // ---------- BOOK FLIGHT ----------
  bookFlight() {
    const flightId = this.bookForm.value.flightId;

    const bookingReq = {
      customerName: this.bookForm.value.name,
      customerEmail: this.bookForm.value.email,
      totalSeats: this.bookForm.value.seats,
      gender: this.bookForm.value.gender,
      passenger: [
      {
        name: this.bookForm.value.name,
        gender: this.bookForm.value.gender,
        age: 22   // (optional — you may add field later)
      }
    ],

    mealpref: "VEG",
    seatNumber: "15A"
    };

    this.bookingService.bookFlight(flightId, bookingReq)
      .subscribe({
        next: (res: any) => {

          alert("Booking Successful — PNR: " + res.pnr);
          this.pnr = res.pnr;

          const storedFlight = JSON.parse(localStorage.getItem('selectedFlight') || '{}');
          const bookings = JSON.parse(localStorage.getItem('myBookings') || '[]');

          bookings.push({
            pnr: res.pnr,
            name: res.customerName,
            email: res.customerEmail,
            flightId: res.flightId,

            from: storedFlight.from,
            to: storedFlight.to,
            date: storedFlight.date,
            price: storedFlight.price,

            seats: res.numSeats,
            status: res.status
          });

          localStorage.setItem('myBookings', JSON.stringify(bookings));
        },
        error: err => alert(err.error || "Booking failed")
      });
  }

  // ---------- SEARCH TICKET ----------
  searchTicket() {
    this.bookingService.getTicket(this.pnr)
      .subscribe({
        next: res => this.ticket = res,
        error: err => alert(err.error)
      });
  }

  // ---------- BOOKING HISTORY ----------
  loadHistory() {
    this.bookingService.getBookingHistory(this.email)
      .subscribe({
        next: (res: any) => this.history = res,
        error: err => alert(err.error)
      });
  }

  // ---------- CANCEL TICKET ----------
  cancelTicket(pnr: string) {
    if (!confirm("Are you sure you want to cancel this ticket?")) return;
    this.bookingService.cancelTicket(pnr)
      .subscribe({
        next: (res: any) => {
          alert("Ticket cancelled successfully");
          this.ticket = null;
          let bookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
          bookings = bookings.filter((b: any) => b.pnr !== pnr);
          localStorage.setItem('myBookings', JSON.stringify(bookings));
        },
        error: err => alert(err.error)
      });
  }
}
