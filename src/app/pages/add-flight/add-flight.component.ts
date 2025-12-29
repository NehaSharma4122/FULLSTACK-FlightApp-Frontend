import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlightResponse, FlightService } from '../../services/flight.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-flight',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-flight.component.html',
  styleUrls: ['./add-flight.component.css']
})
export class AddFlightComponent {

  flight = {
    airline_name: '',
    airline_logo: '',
    flightNumber: '',
    fromPlace: '',
    toPlace: '',
    departure: '',
    arrival: '',
    price: 0,
    availableSeats: 0,
    mealType: 'BOTH'
  };

  constructor(private flightService: FlightService, private router: Router) { }

  submitFlight() {

    const payload: any = { ...this.flight };

    const normalizeDate = (value: string) =>
      value?.length === 16   // yyyy-MM-ddTHH:mm
        ? value + ':00'
        : value;

    payload.departure = normalizeDate(payload.departure);
    payload.arrival = normalizeDate(payload.arrival);

    payload.price = Number(payload.price);
    payload.availableSeats = Number(payload.availableSeats);

    payload.mealType = String(payload.mealType).toUpperCase();

    console.log("FINAL PAYLOAD SENT:", payload);

    this.flightService.addFlight(payload).subscribe({
      next: (res: any) => {
        alert("Flight Added Successfully! ID: " + res.id);
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error("Backend Error:", err);
        alert(err.error?.message || "Flight add failed — see console");
      }
    });
  }
}
