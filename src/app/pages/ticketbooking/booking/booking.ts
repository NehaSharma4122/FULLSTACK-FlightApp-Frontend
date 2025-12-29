import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BookingService } from '../../../services/booking.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css']
})
export class BookingComponent implements OnInit {
  bookForm: FormGroup;
  ticket: any = null;

  constructor(private fb: FormBuilder, private bookingService: BookingService, private router: Router,  private cdr: ChangeDetectorRef) {
    this.bookForm = this.fb.group({
      flightId: ['', Validators.required],
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      totalSeats: [1, [Validators.required, Validators.min(1)]],
      mealpref: ['VEG'],
      passenger: this.fb.array([]) 
    });
  }

  ngOnInit() {
    const selectedStr = localStorage.getItem('selectedFlight');
    if (!selectedStr) {
      alert("Please select a flight first!");
      this.router.navigate(['/search']);
      return;
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (selectedStr) {
      const selected = JSON.parse(selectedStr);

      const id = selected.id || selected.flightId; 
      
      console.log("Found ID for booking:", id);

      if (id) {
        this.bookForm.patchValue({ 
          flightId: id,
          customerEmail: user.email || '' 
        });
      }
    }

    this.updatePassengerFields(this.bookForm.get('totalSeats')?.value);

    this.bookForm.get('totalSeats')?.valueChanges.subscribe(val => {
      this.updatePassengerFields(val);
    });
  }

  get passengerArray() {
    return this.bookForm.get('passenger') as FormArray;
  }

  updatePassengerFields(count: number) {
    if (count < 1) return;
    const currentCount = this.passengerArray.length;
    if (count > currentCount) {
      for (let i = currentCount; i < count; i++) {
        this.passengerArray.push(this.fb.group({
          name: ['', Validators.required],
          gender: ['Male', Validators.required],
          age: [22, Validators.required]
        }));
      }
    } else {
      for (let i = currentCount; i > count; i--) {
        this.passengerArray.removeAt(i - 1);
      }
    }
  }

  bookFlight() {
    if (this.bookForm.invalid) {
      alert("Please fill all traveler details.");
      return;
    }

    const fId = this.bookForm.value.flightId;
    const payload = {
      customerName: this.bookForm.value.customerName,
      customerEmail: this.bookForm.value.customerEmail,
      totalSeats: this.bookForm.value.totalSeats,
      passenger: this.bookForm.value.passenger,
      mealpref: this.bookForm.value.mealpref,
      seatNumber: "15A"
    };

    this.bookingService.bookFlight(fId, payload).subscribe({
      next: (resp) => {
        
        let json: any;

        if (typeof resp === 'object' && !Array.isArray(resp)) {
          json = resp;
        }

        else if (typeof resp === 'string') {
          json = JSON.parse(resp);
        }

        else if (Array.isArray(resp)) {
          json = JSON.parse(resp.join(''));
        }

        this.ticket = { ...json };
        this.ticket.totalSeats = json.numSeats;

        console.log("FINAL TICKET →", this.ticket);
        this.cdr.detectChanges();   

        alert("Success! PNR: " + this.ticket.pnr);
      },
      error: (err) => {
        console.error(err);
        alert("Booking failed. Check Gateway (8091) is running.");
      }
    });
  }
}