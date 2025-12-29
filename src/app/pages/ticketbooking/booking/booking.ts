import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookingService } from '../../../services/booking.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css']
})
export class BookingComponent implements OnInit {
  bookForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService, // <--- Connection
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      flightId: [''],
      name: [''],
      email: [''],
      seats: [1],
      gender: ['']
    });
  }

  ngOnInit() {
    const selected = JSON.parse(localStorage.getItem('selectedFlight') || '{}');
    this.bookForm.patchValue({ flightId: selected.flightId });
  }

  bookFlight() {
    const flightId = this.bookForm.value.flightId;
    const payload = {
      customerName: this.bookForm.value.name,
      customerEmail: this.bookForm.value.email,
      totalSeats: this.bookForm.value.seats,
      passenger: [{ name: this.bookForm.value.name, gender: this.bookForm.value.gender, age: 22 }],
      mealpref: "VEG",
      seatNumber: "15A"
    };

    // CONNECTION POINT: POST to Backend
    this.bookingService.bookFlight(flightId, payload).subscribe({
      next: (res) => {
        alert("Success! PNR: " + res.pnr);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => alert("Error: " + err.error)
    });
  }
}